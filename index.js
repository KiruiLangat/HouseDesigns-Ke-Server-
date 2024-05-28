const express = require('express');
const cors = require('cors');
const path = require('path');
const url = require('url');
const connection = require('./MySQLConnector.js');
const dotenv = require('dotenv');


dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());
const port = process.env.PORT || 3002;

const currentFileName = __filename;
const currentDirName = path.dirname(currentFileName);



// swiper carousel: Homepage
app.get(`/api/swiper`, (_req,res) => {
    connection.query(
        'SELECT * FROM SwiperProjects',
        (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).json({error: 'Internal Server Error', message: error.sqlMessage});
            } else {
                
                res.json(results);
            }
        }
    );

});

//swiper carousel: Browse Projects(homepage)
app.get(`/api/browse`, (_req,res) => {
    connection.query(
        'SELECT * FROM BrowseSwiperProjects',
        (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).json({error: 'Internal Server Error'});
            } else {
                res.json(results);
            }
        }
    );

});


//fetch projects from table with sub category id
app.get('/api/residentials/:subCategoryId', (req, res) => {
    const subCategoryId = req.params.subCategoryId;
    connection.query(
        'SELECT * FROM projects WHERE sub_category_id = ?',
        [subCategoryId], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({error: 'Internal Server Error'});
        } else {
            res.json(results);
        }
    });
});


//fetch images from table with project id from projectDescription table
app.get('/api/residentials/project-description/:title', (req, res) => {
    const title = req.params.title;
    connection.query(
        'SELECT projects_id FROM projectDescription WHERE title = ?',
        [title], (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).json({error: 'Internal Server Error'});
            } else {
                const projectId = results[0].projects_id; //Assumes title is the same

                //fetch images from table with project id
                connection.query(
                    'SELECT image_url FROM images WHERE projects_id = ?',
                    [projectId],
                    (error, results) => {
                        if (error) {
                            console.error(error);
                            res.status(500).json({error: 'Internal Server Error'});
                        } else {
                            const images = results.map(row => row.image_url);
                            res.json(images);
                        }
                    }
                );
            }
        }
    );
    
});

//fetch project details from project description table with project title
app.get('/api/residentials/project-details/:title', (req, res) => {
    const title = req.params.title;
    
    //fetch project details from table with project title
    connection.query(
        'SELECT * FROM projectDescription WHERE title = ?',
        [title],
        (error, results) => {
           if (error) {
              console.error(error);
              res.status(500).json({error: error.message});
           } else {
              console.log(results);
              res.json(results[0]);
             
           }
        }
    );
});



app.post('/api/contact-form', (req, res) => {
  const { name, email, number, message } = req.body;

  connection.query(
    'INSERT INTO contactForm (Name, Email, Number, Message) VALUES (?, ?, ?, ?)',
    [name, email, number, message],
    (error, _results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ message: 'Form submitted successfully' });
      }
    });
}); 

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'public_html')));


// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get( '*', (req, res) => { 
    res.sendFile(path.resolve(__dirname, 'public_html','index.html')); 
});

app.listen(port, () => {
    console.log(`Server is running on port http://housedesigns.co.ke:${port}`);
});




