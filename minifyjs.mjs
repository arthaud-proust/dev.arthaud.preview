import {minify} from 'minify';
import tryToCatch from 'try-to-catch';
import * as path from 'path';
import * as fs from 'fs';

// const options = {
//     html: {
//         removeAttributeQuotes: false,
//         removeOptionalTags: false,
//     },
// };
const __dirname = path.resolve();

const test = () => new Promise(async (resolve) => {
    const folders = fs.readdirSync( path.join(__dirname, '/public/js/dist') );
    var entries = {};

    for(let folder of folders) {
        const files = fs.readdirSync( path.join(__dirname, `/public/js/dist/${folder}/`) );
        for(let file of files) {
            entries[`${folder}-${file}`] = {
                import: `./public/js/dist/${folder}/${file}`,
                filename: `/public/js/dist/${folder}/${file.split('.')[0]}-min.js`
            };
        }
    }

    for (const [key, file] of Object.entries(entries)) {
        const [error, data] = await tryToCatch(minify, file.import);

        if (error)
            return console.error(error.message);

        fs.writeFileSync( path.join(__dirname, file.filename ), data );
        // console.log(data);
    }
    resolve(entries)
})



test().then(r=>console.log(r));