import TagItem from "./tag";
import { Button, Textarea, Input, Container, Select } from "@medusajs/ui";
import { Trash } from "@medusajs/icons";
import { useState } from "react";
import { useAdminCustomDelete, useAdminDeleteFile  } from "medusa-react";
import { createPathRequest, separateBlogsScript } from "../../utils/utils";
import { useNavigate } from 'react-router-dom';



const UploadArticleItem = (props) => {
    const [ showConfirmationDelete, setShowConfirmationDelete ] = useState(false);

    const navigate = useNavigate();
    const customDelete = useAdminCustomDelete(
        createPathRequest(props.articleId), []
    )
    const mutateDelete = customDelete.mutate;
    const deleteFile = useAdminDeleteFile();

    async function deleteArticle() {
        const article = await props.getContent(true);

        const uploadPromises = [];

        if (article.body_images) {
            for (let image of article.body_images) {
                if (image) {
                    let file_key = image.split('/').slice(-1)[0];
                    const uploadPromise = new Promise(async (resolve, reject) => {
                        deleteFile.mutate({ file_key: file_key }, {
                            onSuccess: () => {
                                resolve(undefined);
                            },
                            onError: () => {
                                reject();
                            }
                        })
                    })
                    uploadPromises.push(uploadPromise);
                }
            }
        }

        if (article.body_images_ar) {
            for (let image of article.body_images_ar) {
                if (image) {
                    let file_key = image.split('/').slice(-1)[0];
                    const uploadPromise = new Promise(async (resolve, reject) => {
                        deleteFile.mutate({ file_key: file_key }, {
                            onSuccess: () => {
                                resolve(undefined);
                            },
                            onError: () => {
                                reject();
                            }
                        })
                    })
                    uploadPromises.push(uploadPromise);
                }
            }
        }

        if (article.thumbnail_image) {
            let file_key = article.thumbnail_image.split('/').slice(-1)[0];
                const uploadPromise = new Promise(async (resolve, reject) => {
                    deleteFile.mutate({ file_key: file_key }, {
                        onSuccess: () => {
                            resolve(undefined);
                        },
                        onError: () => {
                            reject();
                        }
                    })
                })
            uploadPromises.push(uploadPromise);
        }

        try {
            await Promise.all(uploadPromises);
        } catch (e) {
            return props.setSubmitError("One or more images inside the article could not be deleted")
        }
        mutateDelete(
            void 0, {
                onSuccess: () => {
                    navigate("/a/articles");
                },
                onError: () => {
                    return props.setSubmitError("Couln't connect to the server to delete the article")
                }
            }
        )
    }

    const {englishCategories, arabicCategories} = separateBlogsScript(props.categories)

    const handleValueChange = (value, lang) => {
        if(lang === 'en') {
            props.category.current = value
        } else if(lang === 'ar') {
            props.categoryAr.current = value
        }

        props.debounceAutoSave();
    }

    return (
        <div id="publish-container" className={`slide-parent ${props.show_upload ? "active" : ""}`}>
            <Container className="py-5 mt-4 relative">
                {
                    showConfirmationDelete ?
                    (
                        <div onClick={() => {setShowConfirmationDelete(false);}} className="absolute z-20 top-0 left-0 w-full h-full backdrop-blur flex flex-col gap-0.5 items-center text-center justify-center">
                            <p className="font-medium w-72 text-xl">
                                Are you sure you want to delete this article?
                            </p>
                            <p className="text-gray-500 w-72 font-medium">
                                This action can't be undone
                            </p>
                            <Button variant="danger" className="mt-3 flex items-center text-sm px-4" onClick={deleteArticle}>
                                <Trash />
                                <span>Delete</span>
                            </Button>
                        </div>
                    ) : ""
                }
                <div className="flex flex-col items-center gap-1">
                    <div className="flex justify-center">
                        <p className="text-center font-light text-xs text-gray-400/80 max-w-sm">Note that these inputs are not mandatory, as their use depends on your frontend</p>
                    </div>
                    <div className="grid grid-cols-2 gap-x-5 gap-y-4 text-sm w-full p-4">
                        <div className="flex flex-col gap-0.5">
                            <label htmlFor="author" className="text-xs text-gray-400 ml-2 font-medium">Author</label>
                            <Input id="author" name="author" type="text" placeholder='Author' />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <label htmlFor="author_ar" className="text-xs text-gray-400 ml-2 font-medium">Author (AR)</label>
                            <Input id="author_ar" name="author_ar" type="text" placeholder='Author (AR)' />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <label htmlFor="tags" className="text-xs text-gray-400 ml-2 font-medium">Tags</label>
                            <TagItem id={"tags"}/>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <label htmlFor="tags_ar" className="text-xs text-gray-400 ml-2 font-medium">Tags (AR)</label>
                            <TagItem id={"tags_ar"}/>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <label htmlFor="seo-title" className="text-xs text-gray-400 ml-2 font-medium">SEO title</label>
                            <Input id="seo-title" name="seo-title" placeholder='SEO title' type="text" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <label htmlFor="seo-title_ar" className="text-xs text-gray-400 ml-2 font-medium">SEO title (AR)</label>
                            <Input id="seo-title_ar" name="seo-title_ar" placeholder='SEO title (AR)' type="text" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <label htmlFor="seo-keywords" className="text-xs text-gray-400 ml-2 font-medium">SEO keywords</label>
                            <Input id="seo-keywords" name="seo-keywords" placeholder='SEO keywords' type="text" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <label htmlFor="seo-keywords_ar" className="text-xs text-gray-400 ml-2 font-medium">SEO keywords (AR)</label>
                            <Input id="seo-keywords_ar" name="seo-keywords_ar" placeholder='SEO keywords (AR)' type="text" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <label htmlFor="url-slug" className="text-xs text-gray-400 ml-2 font-medium">Url slug</label>
                            <Input id="url-slug" onChange={(event) => event.target.value = slugify(event.target.value)} placeholder='Url slug' type="text" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <label htmlFor="url-slug_ar" className="text-xs text-gray-400 ml-2 font-medium">Url slug (AR)</label>
                            <Input id="url-slug_ar" onChange={(event) => event.target.value = slugify(event.target.value)} placeholder='Url slug (AR)' type="text" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <label htmlFor="seo-description" className="text-xs text-gray-400 ml-2 font-medium">SEO description</label>
                            <Textarea className="max-h-48" id="seo-description" name="seo-description" placeholder='SEO description' ></Textarea>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <label htmlFor="seo-description_ar" className="text-xs text-gray-400 ml-2 font-medium">SEO description (AR)</label>
                            <Textarea className="max-h-48" id="seo-description_ar" name="seo-description_ar" placeholder='SEO description (AR)' ></Textarea>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <label htmlFor="thumbnail-alt" className="text-xs text-gray-400 ml-2 font-medium">Thumbnail alt</label>
                            <Input id="thumbnail-alt" name="thumbnail-alt" placeholder='Thumbnail alt' type="text" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <label htmlFor="thumbnail-alt-ar" className="text-xs text-gray-400 ml-2 font-medium">Thumbnail alt (AR)</label>
                            <Input id="thumbnail-alt-ar" name="thumbnail-alt-ar" placeholder='Thumbnail alt (AR)' />
                        </div>
                        {englishCategories.length && <div className="flex flex-col gap-0.5">
                            <label className="text-xs text-gray-400 ml-2 font-medium">Category</label>
                            <Select onValueChange={(value) => handleValueChange(value,'en')} value={props.category.current}>
                                <Select.Trigger>
                                    <Select.Value placeholder="Select category" />
                                </Select.Trigger>
                                <Select.Content>
                                    {englishCategories.map((category) => (
                                        <Select.Item key={category.id} value={category.id}>
                                            {category.name}
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select>
                        </div>}
                        {arabicCategories.length && <div className="flex flex-col gap-0.5">
                            <label className="text-xs text-gray-400 ml-2 font-medium">Category (AR)</label>
                            <Select onValueChange={(value) => handleValueChange(value,'ar')} value={props.categoryAr.current}>
                                <Select.Trigger>
                                    <Select.Value placeholder="Select category Ar" />
                                </Select.Trigger>
                                <Select.Content>
                                    {arabicCategories.map((category) => (
                                        <Select.Item key={category.id} value={category.id}>
                                            {category.name}
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select>
                        </div>}
                    </div>
                    <div className="flex justify-center gap-3">
                        {props.articleId ?
                        (
                            <Button onClick={() => setShowConfirmationDelete(true)} variant="danger" className="px-4 h-8 flex gap-1 items-center">
                                <Trash />
                                Delete article
                            </Button>
                        ) :
                        ""}
                        {props.draftStatus ?
                            <Button onClick={async () => {
                                const result = await props.handleChangeDraft(false);
                                if (!result?.error) {
                                    props.setDraftStatus(false);
                                }
                            }} size="large" className="px-6 h-8 mb-0.5">
                                Publish
                            </Button>
                            :
                            <Button onClick={async () => {
                                const result = await props.handleChangeDraft(true);
                                if (!result?.error) {
                                    props.setDraftStatus(true);
                                }
                            }} size="large" className="px-6 h-8 mb-0.5">
                                Become draft
                            </Button>
                        }
                    </div>
                    <div className={props.submitError || props.submitSuccess ? "pt-2 pb-0.5" : ""}>
                        <div className="max-w-xl text-red-500 text-center break-words">
                            <p>{props.submitError}</p>
                        </div>
                        <div className="max-w-xl text-blue-500 text-center break-words">
                            <p>{props.submitSuccess}</p>
                        </div>
                    </div>
                </div>
            </Container>
            <style>
                {
                    `
                        .slide-parent {
                            overflow: hidden; /* Hide overflowing content */
                            height: 0; /* Initially collapse the parent */
                        }
                        .slide-parent.active {
                            height: auto;
                        }
                    `
                }
            </style>
        </div>
    )
}

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-ء-ي]+/g, '') // Remove all non-alphabetic chars except Arabic, Latin, underscores, and hyphens
        .replace(/\-\-+/g, '-')         // Replace multiple - with a single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

export default UploadArticleItem;