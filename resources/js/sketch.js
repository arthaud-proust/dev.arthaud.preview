const axios = require('axios');
const path = require('path');
const fs = require('fs');
const u = require('./utils');


module.exports = class Sketch {
    constructor(sketchManager, code) {
        this.sketchManager = sketchManager;
        this.code = code;
        this.imgVersion = 0;
        this.username = "arthau.d";
        this.links = {
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
        this._users = [];
    }

    get json() {
        return JSON.stringify({
            code: this.code,
            username: this.username,
            user: this.fetchedUser
        });
    }

    get users() {
        return this._users
    }

    fetchUserIfNeeded() {
        return new Promise((resolve, reject) => {
            // axios.get(`https://www.instagram.com/${this.username}/?__a=1`)
            if(this.fetchedUser) {
                console.log('User already fetched');
                resolve();
            } else {
                console.log('Fetch user');
                axios.get(`https://www.instagram.com/${this.username}/`)
                .then(userInfoSource=>{
                    const jsonData = userInfoSource.data.match(/<script type="text\/javascript">window\._sharedData = (.*)<\/script>/)[1].slice(0, -1)
                    const {username, profile_pic_url, full_name} = JSON.parse(jsonData).entry_data.ProfilePage[0].graphql.user;
                    this.fetchedUser = {username, profile_pic_url, full_name};
                    resolve();
                })
            }
        });
    }

    connected(username) {
        return this._users.includes(username)
    }

    join(username) {
        if(this.connected(username)) {
            return 'exist'
        } else {
            this._users.push(username)
            return 'done'
        }
    }

    leave(username) {
        const index = this._users.indexOf(username);
        if (index > -1) {
            this._users.splice(index, 1);
        }
    }


    changeImg(img) {

        return
        fs.writeFile(this.links.img, Buffer.from(img).toString('base64'), function (err) {
            if (err) throw err;
            console.log('Saved!');
        });

        return
        fs.writeFile(this.links.img, Buffer.from(img.split(',')[1], "base64"), function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
    }

    updateImg() {
        this.links.publicImg = `${this.links.baseImg}?v=${++this.imgVersion}`
    }
}