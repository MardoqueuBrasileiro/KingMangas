const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

let webtoons = [
  {
    id: 1,
    title: 'Webtoon 1',
    cover: 'path/to/cover1.jpg',
    chapters: [
      { id: 1, number: 1, title: 'Capítulo 1' },
      { id: 2, number: 2, title: 'Capítulo 2' }
    ]
  },
  {
    id: 2,
    title: 'Webtoon 2',
    cover: 'path/to/cover2.jpg',
    chapters: [
      { id: 3, number: 1, title: 'Capítulo 1' },
      { id: 4, number: 2, title: 'Capítulo 2' }
    ]
  }
  // Adicione mais webtoons com seus respectivos capítulos aqui
];

const mostRead = [
  {
    id: 1,
    title: 'Webtoon Mais Lido 1',
    cover: 'path/to/cover1.jpg'
  },
  {
    id: 2,
    title: 'Webtoon Mais Lido 2',
    cover: 'path/to/cover2.jpg'
  },
  // Adicione mais webtoons mais lidos aqui
];

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index', { webtoons, mostRead });
});

app.get('/webtoon/:id', (req, res) => {
  const id = req.params.id;
  const webtoon = webtoons.find(w => w.id == id);
  if (webtoon) {
    res.render('webtoon', { webtoon });
  } else {
    res.send('Webtoon não encontrada');
  }
});

app.get('/panel', (req, res) => {
  res.render('panel', { webtoons });
});

app.get('/panel/create', (req, res) => {
  res.render('create');
});

app.post('/panel/create', upload.single('cover'), (req, res) => {
  const title = req.body.title;
  const author = req.body.author;
  const description = req.body.description;
  const cover = req.file.filename; // Obtém o nome do arquivo da capa

  const newWebtoon = {
    id: uuidv4(),
    title,
    author,
    description,
    cover, // Adiciona o nome do arquivo da capa à propriedade 'cover'
    chapters: []
  };

  webtoons.push(newWebtoon);
  res.redirect('/panel');
});



app.get('/panel/:webtoonId/upload', (req, res) => {
  const webtoonId = req.params.webtoonId;
  const webtoon = webtoons.find(w => w.id == webtoonId);
  if (!webtoon) {
    res.status(404).send('Webtoon not found');
    return;
  }
  res.render('upload', { webtoon });
});

app.post('/panel/:webtoonId/upload', upload.single('chapterFile'), (req, res) => {
  const webtoonId = req.params.webtoonId;
  const chapterNumber = req.body.chapterNumber;
  const chapterTitle = req.body.chapterTitle;
  
  // Verifica se um arquivo foi enviado
  if (!req.file) {
    res.status(400).send('No chapter file uploaded');
    return;
  }
  
  const chapterFilename = req.file.filename;

  const webtoon = webtoons.find(w => w.id == webtoonId);
  if (!webtoon) {
    res.status(404).send('Webtoon not found');
    return;
  }

  const newChapter = {
    id: webtoon.chapters.length + 1,
    number: chapterNumber,
    title: chapterTitle,
    filename: chapterFilename
  };

  webtoon.chapters.push(newChapter);
  console.log(webtoon); // Exibe o estado atualizado do objeto webtoon

  res.redirect('/panel/' + webtoonId); // Redireciona para a página do painel da webtoon correta
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
