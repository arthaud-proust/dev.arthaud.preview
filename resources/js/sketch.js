const axios = require('axios');
const { userInfo } = require('os');
const path = require('path');
const u = require('./utils');


module.exports = class Sketch {
    constructor(sketchManager, code) {
        this.sketchManager = sketchManager;
        this.code = code;
        this.codeText = "Code: "+code;

        this.imgVersion = 0;
        this.username = "arthau.d";
        this.likes = parseInt(Math.random()*1000);
        this.fakeComments = parseInt(Math.random()*100)
        this.desc="Lorem ipsum dolor sit amet";
        this.links = {
            folder: path.join(__dirname, '../../public/sketchs/'+this.code),
            publicFolder: '/sketchs/'+this.code+'/',
            baseImg: '/sketchs/'+this.code+'.jpg',
            publicImg: '/sketchs/'+this.code+'.jpg',
            img: path.join(__dirname, '../../public/sketchs/'+this.code+'.jpg'),
            show: `/sketch/${this.code}`,
            edit: `/sketch/${this.code}/edit`,
        }
        this.fetchedUser = {
            username: 'arthau.d',
            profile_pic_url: 'https://instagram.fcdg2-1.fna.fbcdn.net/v/t51.2885-19/s150x150/156523086_913119562838030_6495216512289878339_n.jpg?tp=1&_nc_ht=instagram.fcdg2-1.fna.fbcdn.net&_nc_ohc=RE8ChGUTA-0AX_S4tjI&oh=c3aab33d61fc527f54924291ce530c50&oe=60767574',
            full_name: 'Proust is back'
        };

        this.imgs = [];
        this.fillImgs();

        u.mkdir(this.links.folder);

    }

    get json() {
        return JSON.stringify({
            code: this.code,
            username: this.username,
            user: this.fetchedUser
        });
    }

    close() {
        u.rmdir(this.links.folder);
    }

    fillImgs() {
        for(let n=0; n<10; n++) {
            this.imgs.push({
                version:0,
                src: `/static/bg${n}.svg`,
                n
            })
        }
    }

    fetchUserIfNeeded() {
        return new Promise((resolve, reject) => {
            // axios.get(`https://www.instagram.com/${this.username}/?__a=1`)
            if(this.fetchedUser) {
                console.log('User already fetched');
                resolve();
            } else {
                console.log('Fetch user');
                axios.get(`https://www.instagram.com/${this.username}/`, { 'User-Agent': 'Mozilla/5.0' } )
                .then(userInfoSource=>{
                    const jsonData = userInfoSource.data.match(/<script type="text\/javascript">window\._sharedData = (.*)<\/script>/)[1].slice(0, -1)
                    console.log(jsonData);
                    const {username, profile_pic_url, full_name} = JSON.parse(jsonData).entry_data.ProfilePage[0].graphql.user;
                    this.fetchedUser = {username, profile_pic_url, full_name};
                    resolve();
                })
                .catch(e=>{
                    console.log(e);
                    resolve();
                })
            }
        });
    }

    updateImg() {
        this.links.publicImg = `${this.links.baseImg}?v=${++this.imgVersion}`
    }

    updateNImg(n) {
        this.imgs[n].src = `${this.links.publicFolder}${n}.jpg?v=${++this.imgs[n].version}`
    }
}