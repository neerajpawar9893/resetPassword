const Colony = require('../model/colonyModel');

exports.getColony =(req, res, next) => {
    res.render('colony' , {
        title: 'Add Colony',
        path: '/colony',
        isAuth: req.session.isLoggedIn
    })
}

exports.getColonyList =(req, res, next) => {
    Colony.find({is_deleted: 0})
    .then(colony => {
        res.render('colonyList',{
            title: 'Colony List',
            colony: colony,
            path: '/colonyList',
            isAuth: req.session.isLoggedIn
        })
    })
    .catch(err => console.log(err));
};

exports.postColony = (req, res, next) => {
    const state = req.body.state;
    const city = req.body.city;
    const colonyName = req.body.colonyName;
    const area = req.body.area;
    const colonySize = req.body.colonySize;
    const noOfPlot = req.body.noOfPlot;
    const date = req.body.date;
    const address = req.body.address;
    const otherInfo = req.body.otherInfo
   const colony = new Colony ({
       state: state,
       city: city,
       colonyName: colonyName,
       area: area,
       colonySize: colonySize,
       noOfPlot: noOfPlot,
       date: date,
       address: address,
       otherInfo: otherInfo,
    //    userId: req.session.user._id
   })
   colony.save()
   .then(result => {
    console.log('Colony Save Success');
    res.redirect('/colonyList');
})
   .catch(err => console.log(err));
};

exports.getEditColony = (req, res, next) => {
    const colonyId = req.params.colonyId;
    Colony.findById(colonyId)
    .then(colony => {
        res.render('editColony',{
            title: 'Edit Colony',
            colony: colony,
            path: '/editColony',
            isAuth: req.session.isLoggedIn
        })
        // console.log(colony)
    })
    .catch(err => console.log(err));
};

exports.updateColony = (req, res, next) => {
    const colonyId = req.body.colonyId;
    let colony = req.body;
    console.log(colony)
    Colony.findByIdAndUpdate(colonyId, colony)
    .then(result => {
        console.log('Colony Update Success');
        res.redirect('/colonyList')
    })
    .catch(err=> console.log(err));
};

exports.deleteColony = (req, res, next) => {
    const colonyId = req.body.colonyId;
    console.log(colonyId)
    Colony.findByIdAndUpdate({_id: colonyId, is_deleted: 0},{is_deleted: 1})
    .then(result => {
        console.log('colony Delete Success');
        res.redirect('/colonyList')
    })
    .catch(err => console.log(err));
}