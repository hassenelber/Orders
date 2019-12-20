const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const axios = require("axios");

const Order = require('./ordersModels');
const checkAuth = require("../middleware/check-auth");



router.get('/', checkAuth, (req, res, next) => {
    Order.find()
    // .select(' _id title host venue about price dtime')
    // .populate("eventID")
    .exec()
    .then( docs => {            
        
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        eventID: doc.eventID,
                        userID: doc.userID,
                        quantity: doc.quantity,
                        request : {
                            type: 'GET',
                            url: 'http://localhost:7777/orders/' + doc._id
                        }                    
                    }
                })
    
            });            

    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });


});


router.post('/', checkAuth, (req, res, next) => {
    


    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        eventID: mongoose.Types.ObjectId(req.body.eventID),
        userID: mongoose.Types.ObjectId(req.body.userID),
        quantity: req.body.quantity
    });

    order.save()
    .then(result =>{
        console.log(result);
        res.status(201).json({
            message: "Order created",
            createdOrder: {
                _id: result._id,
                eventID: result.eventID,
                userID: result.userID,
                request: {
                    type: 'GET',
                    url: 'http://localhost:7777/orders/' + result._id
                }

            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
    
    

});


router.get('/:_id', checkAuth, (req, res, next) =>{
    const id = req.params._id;
    const returnus = [];
    Order.findById(id).exec()
    .then(doc => {
        if (!doc) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }
        returnus[0] = doc;
        return axios.get("http://localhost:7779/users/"+ doc.userID);       
    }).then(user =>{

        returnus[1] = user.data;
        return axios.get("http://localhost:7778/events/"+ returnus[0].eventID);  
        
    }).then(event =>{
        returnus[2] = event.data;
        res.status(200).json({
            orderID: returnus[0]._id,
            quantity: returnus[0].quantity,
            orderDate: returnus[0].createdAt,
            userName: returnus[1].event.name,
            eventTitle: returnus[2].event.title,
            eventHost: returnus[2].event.host,
            eventVenue: returnus[2].event.venue,
            eventDate: returnus[2].event.dtime,
            eventPrice: returnus[2].event.price,
            
        })
        

    })
        .catch( err => {
                console.log(err);
                res.status(500).json({error: err})
        });
    })




router.delete("/:_id", checkAuth, (req, res, next) => {
    const id = req.params._id;
    Order.remove({ _id: id})
    .exec()
    .then( result => {
        res.status(200).json({
            message: 'Order deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:7777/orders',
                // data: {title: 'String', host: 'String', price: 'Number'}
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.patch("/:_id", checkAuth, (req, res, next) => {
    const id = req.params._id;
    const updatOps = {};
    for ( const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Order.update({_id: id}, { $set: updatOps})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Order updated',
            request: {
                type: 'GET',
                url: 'http://localhost:7777/orders' + id

            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });

})

module.exports = router;

















// router.post('/', (req, res, next) => {
//     Event.findById(req.body.eventID)
//     .then( event =>{

//         if (!event) {
//             return res.status(404).json({
//               message: "Event not found"
//             });
//           }

//           const order = new Order({
//             _id: new mongoose.Types.ObjectId(),
//             eventID: req.body.eventID,
//             userID: req.body.userID,
//             quantity: req.body.quantity
//         });
//         return order.save();

//     })
//     .then(result =>{
//         console.log(result);
//         res.status(201).json({
//             message: "Order created",
//             createdOrder: {
//                 _id: result._id,
//                 eventID: result.eventID,
//                 userID: result.userID,
//                 request: {
//                     type: 'GET',
//                     url: 'http://localhost:7777/orders/' + result._id
//                 }

//             }
//         });
//     })
    
    
//     .catch( err => {
//         res.status(500).json({
//             message: "Event Doesn't Exist",
//             error: err
//         });
//     });   

// });



