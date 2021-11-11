const path = require('path');
const u = require('./Utils');
const multer = require('multer');

// let upload = multer({dest: '/public/sketchs'});

module.exports = function(router, sketchManager) {


    // home page
    router.get('/', function(req, res) {
        // res.sendFile(path.join(__dirname, '/../views/index.html'));
        res.render('home', {
            css: [
                'home'
                // 'sketch/index'
            ],
            postJs: [
                'home'
            ],
            theme: '#fdf9f3'
        });
    });


    // handle join and create
    router.post('/', function(req, res) {
        const action = req.body.action;
        if(action === "create") {
            const sketch = sketchManager.create();
            res.redirect(`/${sketch.code}` );
        } else if(action === "join") {
            if (typeof req.body.code === 'string' || req.body.code instanceof String) req.body.code = req.body.code.toUpperCase();
            if (sketchManager.sketchExist(req.body.code)) {
                res.redirect(`/${req.body.code}`);
            } else {
                res.redirect('/404' );
            }
        } else {
            res.redirect('/404' );
        }
    });

    // view sketch
    router.get('/:code', function(req, res) {
        sketchManager.handle(req, res, function(sketch) {
            res.render('sketch', {
                css: [
                    'sketch',
                ],
                preJs: [],
                postJs: [
                    'sketch-functions',
                    'sketch-controls',
                    'sketch-socket',
                    'popup',
                ],                
                sketch: sketch.getData(),
                theme: '#fdf9f3'
            });
        });
    });

    // update a picture
    router.post('/:code/upload/:uuid', function(req, res) {
        sketchManager.handle(req, res, function(sketch) {

            // let upload = multer({ storage: u.storage, fileFilter: u.imageFilter }).single(res.params.n);
            let upload = multer({storage: multer.diskStorage({
                destination: function(req, file, cb) {
                    cb(null,  sketch.paths.folder);
                },
                filename: function(req, file, cb) {
                    cb(null, req.params.uuid + '.jpg');
                    // cb(null, file.fieldname + path.extname(file.originalname));
                }
            }), fileFilter: u.imageFilter }).single(req.params.uuid);


            upload(req, res, function(err) {
                if (req.fileValidationError) {
                    return res.send(req.fileValidationError);
                }
                else if (!req.file) {
                    return res.send('Please select an image to upload');
                }
                else if (err) {
                    return res.send(err);
                }
        
                res.send({
                    ...sketch.updateImg(req.params.uuid),
                    uuid: req.params.uuid,
                    done: true
                });
            });
        });
    });

    router.get('/error/:error', function(req, res) {
        res.render('error', {
            css: [
                'home'
            ],
            postJs: [
                'home'
            ],
            error: u.getError(req.params.error),
            theme: '#fdf9f3'
        });
        // res.redirect('/' );
        // res.sendFile(path.join(__dirname, `/../views/${req.params.error}.html`));
    });
};