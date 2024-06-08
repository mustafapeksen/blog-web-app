import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const texts = [];
const authors = [];
const titles = [];

// Kullanıcıdan gelen metni paragraflara bölen fonksiyon
const splitIntoParagraphs = (text) => {
    return text.split('\n').filter(paragraph => paragraph.trim() !== '');
};

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    // getFormattedPosts fonksiyonu ile post verilerini düzenli bir şekilde alıp ejs'e geçiriyoruz
    res.render("index.ejs", { posts: getFormattedPosts() });
});

app.post("/submit", (req, res) => {
    const title = req.body.title;
    const author = req.body.author;
    const text = req.body.text;

    // Metni paragraflara bölelim
    const paragraphs = splitIntoParagraphs(text);

    // Her bir post için ayrı dizilere ekleyelim
    titles.push(title);
    authors.push(author);
    texts.push(paragraphs);

    res.redirect("/");
});

app.get("/about", (req, res) => {
    res.render("about.ejs");
});

app.get("/contact", (req, res) => {
    res.render("contact.ejs");
});

app.post("/delete/:id", (req, res) => {
    const postId = parseInt(req.params.id);
    
    // DELETE isteği ile gelen post id'sine göre verileri silme işlemini gerçekleştir
    titles.splice(postId, 1);
    authors.splice(postId, 1);
    texts.splice(postId, 1);

    res.redirect("/");
});

app.get("/edit/:id", (req, res) => {
    const postId = parseInt(req.params.id);
    
    // GET isteği ile gelen post id'sine göre düzenleme sayfasını render etme işlemini gerçekleştir
    res.render("edit.ejs", { post: getPostById(postId) });
});

app.post("/edit/:id", (req, res) => {
    const postId = parseInt(req.params.id);
    const updatedTitle = req.body.title;
    const updatedAuthor = req.body.author;
    const updatedText = req.body.text;

    // Metni paragraflara bölelim
    const updatedParagraphs = splitIntoParagraphs(updatedText);

    // PUT isteği ile gelen post id'sine göre verileri güncelleme işlemini gerçekleştir
    titles[postId] = updatedTitle;
    authors[postId] = updatedAuthor;
    texts[postId] = updatedParagraphs;

    res.redirect("/");
});

// Tüm postları düzenli bir formatta almak için yardımcı fonksiyon
const getFormattedPosts = () => {
    return titles.map((title, index) => ({
        title,
        author: authors[index],
        text: texts[index],
        id: index,
    }));
};

// Belirli bir postu id'ye göre almak için yardımcı fonksiyon
const getPostById = (id) => {
    return {
        title: titles[id],
        author: authors[id],
        text: texts[id],
        id: id,
    };
};

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
