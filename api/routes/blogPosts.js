const express = require('express');
const router = express();
const Database = require('../../Database'); // Update the path as needed
const path = require('path')

// :header -  is the header of the blog post
router.get('/showPost/:header', async (req, resp, next) => {
        header = req.params.header
        try {
            const blogPostData = await Database.getBlogPostByheader(header);
            console.log(blogPostData)
            if (blogPostData.ok) {
                const blogPost_dir = `${blogPostData.header.replace(/-/g,'_')}`;
                server_json_GET_resp = {
                    ...blogPostData,
                    blogPost_header: blogPostData.header,
                    sub_header_HTML: `${blogPost_dir}/sub_header.html`,
                    home_page_summary_HTML: `${blogPost_dir}/home_page_summary.html`,
                    articleHTML: `${blogPost_dir}/blogPost_article.html`,
                    pics_dir: `${blogPost_dir}/blogPost_pics/`,
                }
                console.log('server_json_GET_response: ',server_json_GET_resp)
                resp.status(200).json(server_json_GET_resp);
            } else {
                resp.status(404).json({ message: blogPostData.reason });
            }
        } catch (error) {
            console.log(error)
            resp.status(500).json({ message: 'Internal server error' });
        }
    }
);


router.use('/blogPostItems/:header/:file', (req, res, next) => {
    const header = req.params.header;
    const file = req.params.file;
    const filePath = path.join(__dirname, '..', '..', 'blogPosts', header, file);
    console.log(filePath)
    res.sendFile(filePath, (err) => {
      if (err) {
        next(err);
      }
    });
  });


module.exports = router