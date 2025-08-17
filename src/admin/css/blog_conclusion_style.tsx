const BlogConclusionStyle = () => {
    return (
        <style>
            {
                `
                .cdx-blog-conclusion {
                    position: relative;
                }

                @media all and (min-width: 736px) {
                    .cdx-blog-conclusion {
                        padding-left: 36px;
                    }
                }

                .cdx-blog-conclusion [contentEditable=true][data-placeholder]::before {
                    position: absolute;
                    content: attr(data-placeholder);
                    color: #707684;
                    font-weight: normal;
                    opacity: 0;
                }

                .cdx-blog-conclusion [contentEditable=true][data-placeholder]:empty::before {
                    opacity: 1;
                }

                .cdx-blog-conclusion [contentEditable=true][data-placeholder]:empty:focus::before {
                    opacity: 0;
                }

                .cdx-blog-conclusion__message {
                    min-height: 85px;
                }

                .cdx-blog-conclusion__title {
                    margin-bottom: 6px;
                }
                `
            }
        </style>
    )
}

export default BlogConclusionStyle;