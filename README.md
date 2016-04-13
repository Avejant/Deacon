# Deacon
Project management Expess.js application

1. First of all you should download this repository.
2. After this, go to repository root folder.
3. You should install globally bower, node-mongo-seeds and forever packages via npm:
   'npm install -g bower'
   'npm install -g node-mongo-seed'
   'npm install -g forever'
4. You should change path to database and server(if they difference from default) in next files: 'configs/config.js' and 'seed.json'.
5. After this run consequentially next commands: 'npm install', 'bower install', 'seed'.
6. Run command 'forever start app.js'.
7. Open your browser and go to url, that you defined as 'appUrl' in config.js file.
