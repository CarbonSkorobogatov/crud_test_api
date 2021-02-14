const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 8080;
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
let IsLogAdmin = false; 
let listgoods = fs.readFileSync('./goods.json');
let goods = [];
goods = JSON.parse(listgoods);


app.use(jsonParser);

app.post('/admin', (req, res) => {
    const Admin = req.body;
    if(Admin.name == "admin" && Admin.password == "admin")
    {
        IsLogAdmin = true; 
        res.send({success: true})
    }
    else
    {
        return res.status(400).send({success: false, message: "Write correct login or password"})
    }
});

app.post('/admin/product', (req, res) =>{
    if(IsLogAdmin == true)
    {
        const NewGood = req.body;
        
        NewGood.id = Date.now();
        if(!NewGood.name) NewGood.name = `good_${NewGood.id}`;
         
            
        goods.push(NewGood);
        const new_good = JSON.stringify(goods);

        try
        {
            fs.writeFileSync('./goods.json', new_good);
        } 
        catch (e)
        {
            console.error(e);
        }

        res.send({goods});
    }
    else    
    {
        return res.status(400).send({success: false, message: "Please loggining"})
    }
});

app.delete('/admin/product/:id', (req, res) => {
    const goodId = req.params.id;
    const UpdateGoods = goods.filter(good => good.id !== +goodId);
    goods = UpdateGoods; 

    const new_good = JSON.stringify(goods);

    try
    {
        fs.writeFileSync('./goods.json', new_good);
    } 
    catch (e)
    {
        console.error(e);
    }

    res.send({goods});
});

app.put('/admin/product/:id', (req, res) =>{
    const goodId = +req.params.id;
    const UpdateGood = goods.map(g => {
        if(g.id === goodId){
            return Object.assign({}, g, req.body);
        }
        return g; 
    });
    goods = UpdateGood.slice();
    res.send({goods});
});

app.get('/', (req, res) => {
    res.send(`/product - for all goods; admin/ - for worhing with data name: "admin", password: "admin"`);
});

app.get('/product', (req, res) =>{
    res.send(`Имена товаров: ${goods.map( e => e.name)}, `);
});

//power server
app.listen(port, () => {
    console.log(`express server listening on ${port} port`);
});