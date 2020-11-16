const express = require('express')
const app = express()
const Razorpay = require('razorpay');
const crypto = require('crypto');
const cors = require('cors');


app.use(cors())
app.use(express.json());

const PORT = 3000;
const instance = new Razorpay({
    key_id: '',  //Enter your key id here
    key_secret: '', //Enter your key secrete here
})


app.get('/', (req, res) =>{
    res.json({sucess: "true"})
})

app.get('/donate/:amount', (req, res) =>{
   console.log(req.params.amount);

   var options = {
       amount: req.params.amount *100,
       currency: "INR",
       receipt: "order_recepit_11"
   };

   instance.orders.create(options, (err, order)=>{
       if(err) return res.json({error: err})
       else{
           order.key_id = ''  //Enter your key_id here
           return res.json(order)
       }
   })
})

app.post('/verfication', (req, res) =>{
    let body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
    let generated_signature  = crypto.createHmac('sha256', '')  //Enter your key secrete here
                               .update(body.toString()).digest('hex');
    if(generated_signature === req.body.razorpay_signature){
        return res.json({success: true})
    }else{
        return res.json({success: false})
    }
})


app.listen(PORT, () =>{
    console.log("Server started")
})