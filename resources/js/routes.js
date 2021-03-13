const path = require('path');
const u = require('./utils');
const multer = require('multer');

// let upload = multer({dest: '/public/sketchs'});

module.exports = function(router, sketchManager) {

    router.get('/', function(req, res) {
        // res.sendFile(path.join(__dirname, '/../views/index.html'));
        res.render('home');
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
            res.render('sketch', {
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
                postJs: [
                    'sketch'
                ],
                comments: [
                    {author:'bob', content:'Jolie photo!'}
                ],
                sketch: sketchManager.getSketch(req.params.code)
            });
        });
    });

    router.get('/sketch/:code/edit', function(req, res) {
        sketchManager.handle(req, res, function() {
            res.render('sketchEdition', {
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
                else if (err instanceof multer.MulterError) {
                    return res.send(err);
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

    router.get('/sketch/:code/json', function(req, res) {
        res.send(sketchManager.getSketch(req.params.code).json);
    });


    router.get('/:error', function(req, res) {
        res.sendFile(path.join(__dirname, `/../views/${req.params.error}.html`));
    });
};