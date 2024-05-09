import express from 'express';
import cors from 'cors';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import connection from './MySQLConnector.js'
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
//import twilio from 'twilio';

dotenv.config();
const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use(cors())
const port = 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use('/', express.static(path.join(__dirname, 'public_html')))


//fetch projects from table with sub category id
app.get('/api/residentials/:subCategoryId', (req, res) => {
    const subCategoryId = req.params.subCategoryId;
    connection.query(
        'SELECT * FROM projects WHERE sub_category_id = ?',
        [subCategoryId], (error, results) => {
        if (error) {
            console.error(error)
            res.status(500).json({error: 'Internal Server Error'});
        } else {
            res.json(results);
        }
    });
})


//fetch images from table with project id from projectDescription table
app.get('/api/residentials/project-description/:title', (req, res) => {
    const title = req.params.title;
    connection.query(
        'SELECT projects_id FROM projectDescription WHERE title = ?',
        [title], (error, results) => {
            if (error) {
                console.error(error)
                res.status(500).json({error: 'Internal Server Error'});
            } else {
                const projectId = results[0].projects_id; //Assumes title is the same

                //fetch images from table with project id
                connection.query(
                    'SELECT image_url FROM images WHERE projects_id = ?',
                    [projectId],
                    (error, results) => {
                        if (error) {
                            console.error(error)
                            res.status(500).json({error: 'Internal Server Error'});
                        } else {
                            const images = results.map(row => row.image_url);
                            res.json(images);
                        }
                    }
                )
            }
        }
    );
    
})

//fetch project details from project description table with project title
app.get('/api/residentials/project-details/:title', (req, res) => {
    const title = req.params.title;
    
    //fetch project details from table with project title
    connection.query(
        'SELECT * FROM projectDescription WHERE title = ?',
        [title],
        (error, results) => {
           if (error) {
              console.error(error)
              res.status(500).json({error: error.message});
           } else {
              console.log(results);
              res.json(results[0]);
             
           }
        }
    )
})



app.post('/api/contact-form', async (req, res) => {
  const { name, email, number, message } = req.body;

  connection.query(
    'INSERT INTO contactForm (Name, Email, Number, Message) VALUES (?, ?, ?, ?)',
    [name, email, number, message],
    async (error, _results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ message: 'Form submitted successfully' });
      }
    })
    //   } else {
    //     const client = twilio(
    //       process.env.TWILIO_ACCOUNT_SID,
    //       process.env.TWILIO_AUTH_TOKEN
    //     );

    //     try{
    //         await client.messages.create({
    //             body: `New form submission:\nName: ${name}\nEmail: ${email}\nPhone: ${number}\nMessage: ${message}`,
    //             from: 'whatsapp:' + process.env.TWILIO_PHONE_NUMBER,
    //             to: 'whatsapp:' + process.env.MY_PHONE_NUMBER
    //         });
    //         res.json({ message: 'Message sent successfully' });

    //     } catch (error){
    //         console.error(error);
    //         res.status(500).json({ error: 'Failed to send whatsapp message' });
    //     }  
    
});   

// swiper carousel: Homepage
app.get(`/api/swiper`, (_req,res) => {
    connection.query(
        'SELECT * FROM SwiperProjects',
        (error, results) => {
            if (error) {
                console.error(error)
                res.status(500).json({error: 'Internal Server Error'});
            } else {
                res.json(results);
            }
        }
    )

})

//swiper carousel: Browse Projects(homepage)
app.get(`/api/browse`, (_req,res) => {
    connection.query(
        'SELECT * FROM BrowseSwiperProjects',
        (error, results) => {
            if (error) {
                console.error(error)
                res.status(500).json({error: 'Internal Server Error'});
            } else {
                res.json(results);
            }
        }
    )

})

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});