
const fs = require('fs');
const path = require('path');
const https = require('https');

var account = 'Ashung',
    project = 'Automate-Sketch';

var options = {
    hostname: 'api.github.com',
    port: 443,
    path: '/repos/' + account + '/' + project + '/releases',
    method: 'GET',
    headers: {
        'user-agent': 'node.js'
    }
};

var req = https.get(options, function(res) {
    var content = '';
    res.on('data', function(data) {
        content += data;
    });
    res.on('end', function() {
        var json = JSON.parse(content);
        if (res.statusCode === 200) {
            var release = json.map(function(item) {
                return {
                    "title": item.name || item.tag_name,
                    "description": item.body,
                    "pubDate": (new Date(item.published_at)).toGMTString(),
                    "version": item.tag_name.replace(/^v/i, ''),
                    "url": 'https://github.com/' + account + '/' + project + '/archive/' + item.tag_name + '.zip'
                }
            });

            fs.writeFileSync(path.join(__dirname, '../_data/release.json'), JSON.stringify(release, null, 4));

            console.log("Done.")

        } else {
            console.log(json.message);
        }
    });
}).on('error', function(e) {
    console.error(e);
});
