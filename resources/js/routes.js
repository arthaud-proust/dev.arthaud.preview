const path = require('path');
const u = require('./utils');
const multer = require('multer');

// let upload = multer({dest: '/public/sketchs'});

module.exports = function(router, sketchManager) {

    router.get('/', function(req, res) {
        // res.sendFile(path.join(__dirname, '/../views/index.html'));
        res.render('home', {
            styles: [
                'fromInsta/Consumer',
                'fromInsta/ConsumerUICommons',
                'fromInsta/FeedPageContainer',
                'fromInsta/Consumer',
                // 'fromInsta/ActivityFeedBox',
                'fromInsta/ConsumerUICommons',
                'fromInsta/FeedPageContainer',
                'fromInsta/ProfilePageContainer',
                'fromInsta/SettingsModules',
                'vanilla/sketch'
            ],
            theme: '#BB004B'
        });
    });


    router.get('/msketch', function(req, res) {
        res.render('msketch', {
            styles: [
                'fromInsta/Consumer',
                // 'fromInsta/ActivityFeedBox',
                'fromInsta/ConsumerUICommons',
                'fromInsta/FeedPageContainer',
                // 'fromInsta/FeedSidebarContainer',
                'fromInsta/MobileAllCommentsPage',
                // 'fromInsta/PostComments',
                'vanilla/sketch'
            ]
        });
    });

    router.get('/profile/:sketch', function(req, res) {
        res.sendFile(path.join(__dirname, '/../views/name.html'));
    });


    router.post('/create', function(req, res) {
        const sketch = sketchManager.create(req.body.code);
        res.redirect(`/sketch/${sketch.code}` );
    });

    router.post('/join', function(req, res) {
        let sketch = sketchManager.getSketch(req.body.code);
        if (sketch) {
            res.redirect(`/sketch/${sketch.code}`);
        } else {
            res.redirect('/404' );
        }
    });

    router.get('/sketch/:code', function(req, res) {
        sketchManager.handle(req, res, function() {
            res.render('msketch', {
                styles: [
                    'fromInsta/Consumer',
                    // 'fromInsta/ActivityFeedBox',
                    'fromInsta/ConsumerUICommons',
                    'fromInsta/FeedPageContainer',
                    // 'fromInsta/FeedSidebarContainer',
                    'fromInsta/MobileAllCommentsPage',
                    // 'fromInsta/PostComments',
                    'vanilla/sketch'
                ],
                preJs: [
                    // 'fromInsta/__d',
                    // 'fromInsta/more',
                ],
                postJs: [
                    'sketch',

                    // 'fromInsta/Vendor',
                    // 'fromInsta/fr_FR',
                    // 'fromInsta/ConsumerLibCommons',
                    // 'fromInsta/ConsumerUiCommons',
                    // 'fromInsta/Consumer',
                    // 'fromInsta/FeedPageContainer',
                    // 'fromInsta/FeedSidebarContainer',
                    // 'fromInsta/PostModalEntrypoint',
                    // 'fromInsta/DirectMQTT',
                    // 'fromInsta/NewUserActivatorsUnit',

                ],                
                sketch: sketchManager.getSketch(req.params.code)
            });
        });
    });

    router.get('/sketch/:code/edit', function(req, res) {
        sketchManager.handle(req, res, function() {
            res.render('msketchEdition', {
                styles: [
                    'fromInsta/Consumer',
                    // 'fromInsta/ActivityFeedBox',
                    'fromInsta/ConsumerUICommons',
                    'fromInsta/FeedPageContainer',
                    'fromInsta/ProfilePageContainer',
                    'fromInsta/SettingsModules',
                    'vanilla/sketch'
                ],
                postJs: [
                    'sketch'
                ],
                sketch: sketchManager.getSketch(req.params.code)
            });
        });
    });

    router.post('/sketch/:code/upload', function(req, res) {
        sketchManager.handle(req, res, function(sketch) {

            let upload = multer({ storage: u.storage, fileFilter: u.imageFilter }).single(sketch.code);
            // let upload = multer({dest: path.join(__dirname, '../../public/sketchs')}).single('image');


            upload(req, res, function(err) {
                // req.file contains information of uploaded file
                // req.body contains information of text fields, if there were any
        
                if (req.fileValidationError) {
                    return res.send(req.fileValidationError);
                }
                else if (!req.file) {
                    return res.send('Please select an image to upload');
                }
                else if (err) {
                    return res.send(err);
                }
        
                // Display uploaded image for user validation
                res.send(`all done`);
            });
            // sketch.changeImg(req.body.image);
        });
    });

    router.post('/sketch/:code/upload/:n', function(req, res) {
        sketchManager.handle(req, res, function(sketch) {

            // let upload = multer({ storage: u.storage, fileFilter: u.imageFilter }).single(res.params.n);
            let upload = multer({storage: multer.diskStorage({
                destination: function(req, file, cb) {
                    cb(null,  sketch.links.folder);
                },
                filename: function(req, file, cb) {
                    cb(null, file.fieldname + path.extname(file.originalname));
                }
            }), fileFilter: u.imageFilter }).single(req.params.n);


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
        
                res.send({n:req.params.n});
            });
        });
    });


    router.get('/sketch/:code/json', function(req, res) {
        res.send(sketchManager.getSketch(req.params.code).json);
    });


    router.get('/:error', function(req, res) {
        res.render('error', {
            styles: [
                'fromInsta/Consumer',
                // 'fromInsta/ActivityFeedBox',
                'fromInsta/ConsumerUICommons',
                'fromInsta/FeedPageContainer',
                'fromInsta/ProfilePageContainer',
                'fromInsta/SettingsModules',
                'vanilla/sketch'
            ],
            postJs: [
                'sketch'
            ],
            error: u.getError(req.params.error)
        });
        // res.redirect('/' );
        // res.sendFile(path.join(__dirname, `/../views/${req.params.error}.html`));
    });
};