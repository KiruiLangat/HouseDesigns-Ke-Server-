const express = require('express');
const cors = require('cors');
const path = require('path');
const url = require('url');
const pool = require('./MySQLConnector.js');
const dotenv = require('dotenv');

const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//app.use(express.static('public_html'));

app.use(cors());
const port = process.env.PORT || 3000;

const currentFileName = __filename;
const currentDirName = path.dirname(currentFileName);

// Serve static files from the React app
app.use(express.static(path.join(currentDirName, 'public_html')));

pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting database connection:', err);
      return;
    }
  
    console.log('Successfully connected to the database.');
    connection.release();
  });


// swiper carousel: Homepage
app.get(`/api/swiper`, (_req,res) => {
    pool.query(
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
    pool.query(
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
    pool.query(
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
    pool.query(
        'SELECT projects_id FROM projectDescription WHERE title = ?',
        [title], (error, results) => {
            if (error) {
                res.status(500).send(error);
            } else if (results[0] === undefined) {
                res.status(404).send('Project not found');
            } else {
                const projectId = results[0].projects_id; //Assumes title is the same

                //fetch images from table with project id
                pool.query(
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
    pool.query(
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

    pool.query(
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




// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get( '*', (req, res) => { 
    res.sendFile(path.resolve(currentDirName, 'public_html','index.html')); 
});

app.listen(port, () => {
    console.log(`Server is running on port http://housedesigns.co.ke:${port}`);
});




