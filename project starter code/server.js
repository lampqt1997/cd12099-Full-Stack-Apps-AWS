import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles, validateUrl} from './util/util.js';



  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]
    app.get("/filteredimage", async (req, res) => {
      console.log("Recieved request",req.query);
      try {
        const { image_url } = req.query;
        console.log("image_url",image_url);
        // Validate the image URL
        const validationError = validateUrl(image_url);
        console.log("validationError",validationError);

        if (validationError) {
          return res.status(400).send(validationError);
        }
        // Filter the image
        const filteredImagePath = await filterImageFromURL(image_url);
        console.log("filteredImagePath",filteredImagePath);

        // Send the filtered image in the response
        res.sendFile(filteredImagePath, async (err) => {
          // Delete the filtered image file from the server after sending the response
          await deleteLocalFiles([filteredImagePath]);
        });
      } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).send('Error processing image');
      }

    });
    /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
