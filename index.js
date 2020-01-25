const express = require('express');

const server = express();

//Importante para que seja possível fazer a leitura em json
server.use(express.json());

const projects = [];

function numberOfRequests(req, res, next){

  console.count("Numero de Requisições");

  next();
}

//Toda vez que for feita uma requisição, será mostrado o número de requisições atualmente.
server.use(numberOfRequests);

//Verifica se a Id fornecida existe, caso não exista retorna um erro.
function checkIdExists(req, res, next){
  const { id } = req.params;
  const project = projects.find(proj => proj.id == id);

  if(project == undefined){
    return res.status(400).json({error:'Id not found'});
  }

  next();

  console.timeEnd('Request');
}

server.post('/projects', (req, res) =>{
  const {id ,title} = req.body;

  const project = {
    id,
    title,
    tasks:[]
  };

  const testeId = projects.find(proj => proj.id == id);

  if(testeId != undefined){
   return  res.status(400).json({error:'Id already exists.'});   //Verifica se existe alguma Id igual à fornecida pelo usuário.Caso já exista , retorna erro.
  }

  projects.push(project);

  return res.json(project);
});

server.get('/projects', (req, res)=>{
  return res.json(projects);
});

server.put('/projects/:id',  checkIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

server.delete('/projects/:id',checkIdExists, (req, res)=>{
  const { id } = req.params;

  const projectIndex = projects.findIndex(proj => proj.id == id);

  
  projects.splice(projectIndex,1);
  

  return res.send(` O elemento de id ${id} foi deletado com sucesso!`);
});

server.post('/projects/:id/tasks',checkIdExists, (req, res) => {
  const { id } = req.params;
  const { task } = req.body;

  const project = projects.find(proj => proj.id == id);

  project.tasks.push(task);

  return res.json(project);
});


server.listen(3000);