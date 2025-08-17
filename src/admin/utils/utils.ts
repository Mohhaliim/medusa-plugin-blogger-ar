import Tagify from '@yaireo/tagify';

/*
This import seems to cause:
Module not found: Error: Can't resolve 'react-native-sqlite-storage'

Which at the time I am writing this comment is not causing any visible problem
*/
import { ILike, Like, Raw, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, And } from "typeorm";

export const listenChangesSave = (debounceAutoSave) => {
    const title = document.getElementById("title");
    title?.addEventListener("keyup", () => debounceAutoSave());
    const title_ar = document.getElementById("title_ar");
    title_ar?.addEventListener("keyup", () => debounceAutoSave());
    const subtitle = document.getElementById("subtitle");
    subtitle?.addEventListener("keyup", () => debounceAutoSave());
    const subtitle_ar = document.getElementById("subtitle_ar");
    subtitle_ar?.addEventListener("keyup", () => debounceAutoSave());
    const author = document.getElementById("author");
    author?.addEventListener("keyup", () => debounceAutoSave())
    const author_ar = document.getElementById("author_ar");
    author_ar?.addEventListener("keyup", () => debounceAutoSave())
    const tags = document.getElementById("tags");
    tags?.addEventListener("change", () => debounceAutoSave())
    const tags_ar = document.getElementById("tags_ar");
    tags_ar?.addEventListener("change", () => debounceAutoSave())
    const seo_title = document.getElementById("seo-title");
    seo_title?.addEventListener("keyup", () => debounceAutoSave())
    const seo_title_ar = document.getElementById("seo-title_ar");
    seo_title_ar?.addEventListener("keyup", () => debounceAutoSave())
    const seo_keywords = document.getElementById("seo-keywords");
    seo_keywords?.addEventListener("keyup", () => debounceAutoSave())
    const seo_keywords_ar = document.getElementById("seo-keywords_ar");
    seo_keywords_ar?.addEventListener("keyup", () => debounceAutoSave())
    const thumbnail_alt = document.getElementById("thumbnail-alt");
    thumbnail_alt?.addEventListener("keyup", () => debounceAutoSave())
    const thumbnail_alt_ar = document.getElementById("thumbnail-alt-ar");
    thumbnail_alt_ar?.addEventListener("keyup", () => debounceAutoSave())
    const url_slug = document.getElementById("url-slug");
    url_slug?.addEventListener("keyup", () => debounceAutoSave())
    const url_slug_ar = document.getElementById("url-slug_ar");
    url_slug_ar?.addEventListener("keyup", () => debounceAutoSave())
    const seo_description = document.getElementById("seo-description");
    seo_description?.addEventListener("keyup", () => debounceAutoSave())
    const seo_description_ar = document.getElementById("seo-description_ar");
    seo_description_ar?.addEventListener("keyup", () => debounceAutoSave())
}

export const loadArticle = (article) => {
    const title = document.getElementById("title") as any;
    title.value = article.title ? article.title : "";
    const title_ar = document.getElementById("title_ar") as any;
    title_ar.value = article.title_ar ? article.title_ar : "";
    const subtitle = document.getElementById("subtitle") as any;
    subtitle.value = article.subtitle ? article.subtitle : "";
    const subtitle_ar = document.getElementById("subtitle_ar") as any;
    subtitle_ar.value = article.subtitle_ar ? article.subtitle_ar : "";
    const author = document.getElementById("author") as any;
    author.value = article.author ? article.author : "";
    const author_ar = document.getElementById("author_ar") as any;
    author_ar.value = article.author_ar ? article.author_ar : "";
    const seo_title = document.getElementById("seo-title") as any;
    seo_title.value = article.seo_title ? article.seo_title : "";
    const seo_title_ar = document.getElementById("seo-title_ar") as any;
    seo_title_ar.value = article.seo_title_ar ? article.seo_title_ar : "";
    const seo_keywords = document.getElementById("seo-keywords") as any;
    seo_keywords.value = article.seo_keywords ? article.seo_keywords : "";
    const seo_keywords_ar = document.getElementById("seo-keywords_ar") as any;
    seo_keywords_ar.value = article.seo_keywords_ar ? article.seo_keywords_ar : "";

    const thumbnail_alt = document.getElementById("thumbnail-alt") as any;
    thumbnail_alt.value = article.thumbnail_alt ? article.thumbnail_alt : "";
    const thumbnail_alt_ar = document.getElementById("thumbnail-alt-ar") as any;
    thumbnail_alt_ar.value = article.thumbnail_alt_ar ? article.thumbnail_alt_ar : "";

    const url_slug = document.getElementById("url-slug") as any;
    url_slug.value = article.url_slug ? article.url_slug : "";
    const url_slug_ar = document.getElementById("url-slug_ar") as any;
    url_slug_ar.value = article.url_slug_ar ? article.url_slug_ar : "";
    const seo_description = document.getElementById("seo-description") as any;
    seo_description.value = article.seo_description ? article.seo_description : "";
    const seo_description_ar = document.getElementById("seo-description_ar") as any;
    seo_description_ar.value = article.seo_description_ar ? article.seo_description_ar : "";

    // Tagify requires a different procedure to load tags
    const tags = document.getElementById("tags");
    const tagsAr = document.getElementById("tags_ar");
    const tagify = new Tagify(tags);
    const tagifyAr = new Tagify(tagsAr);
    tagify.addTags(article.tags);
    tagifyAr.addTags(article.tags_ar);
}

export const formatDateManually = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}  ${hours}:${minutes}:${seconds}`;
}

export const getIdFromCurrentUrl = () => {
    const urlObj = new URL(window.location.href);
    return urlObj.searchParams.get('id');
}

export const addIdFromCurrentUrl = (id) => {
    const urlObj = new URL(window.location.href);
    urlObj.searchParams.set('id', id);
    return urlObj.toString();
}

export const removeIdFromCurrentUrl = () => {
    const urlObj = new URL(window.location.href);
    urlObj.searchParams.delete('id');
    return urlObj.toString();
}

export const createPathRequest = (articleId, base_path = "/blog/articles") => articleId ? base_path + "/" + articleId : base_path

export const convertObjToSearchQuery = (obj) => {
    let result;

    if (Array.isArray(obj)) {
        result = [];
        for (const element of obj) {
            const [key, value_el] = Object.entries(element)[0] as any;

            let object_value_to_analyse = value_el;
            if (!Array.isArray(object_value_to_analyse)) {
                object_value_to_analyse = [object_value_to_analyse];
            }

            const current_result_key_values = [];
            for (let value of object_value_to_analyse) {
                if (typeof value == "string") {
                    if (key == "id") {
                        current_result_key_values.push(Like("%" + value.replace(/[%_]/g, '\\$&')));
                    } else if (key == "created_at" || key == "updated_at") {
                        const date = new Date(value) as any;

                        // If date is NaN return the object as it is
                        if (isNaN(date)) {
                            current_result_key_values.push(value);
                        } else {
                            current_result_key_values.push(date);
                        }
                    } else {
                        current_result_key_values.push(value);
                    }
                } else if (Array.isArray(value) && key == "tags") { // Only works with the column tags
                    const tagsString = `{${value.join(',')}}`;
                    current_result_key_values.push(Raw(alias => `${alias} @> :tags`, { tags: tagsString }));
                } else if (typeof value == "object") {
                    let final_value = value?.value;
                    if (key == "created_at" || key == "updated_at") {
                        const date = new Date(final_value) as any;

                        // If date is NaN return the object as it is
                        if (!isNaN(date)) {
                            final_value = date;
                        }
                    }

                    if (value?.find_operator == "ILike") {
                        final_value = ILike(final_value);
                    } else if (value?.find_operator == "Like") {
                        final_value = Like(final_value);
                    } else if (value?.find_operator == "LessThan") {
                        final_value = LessThan(final_value);
                    } else if (value?.find_operator == "LessThanOrEqual") {
                        final_value = LessThanOrEqual(final_value);
                    } else if (value?.find_operator == "MoreThan") {
                        final_value = MoreThan(final_value);
                    } else if (value?.find_operator == "MoreThanOrEqual") {
                        final_value = MoreThanOrEqual(final_value);
                    }

                    current_result_key_values.push(final_value);
                } else {
                    current_result_key_values.push(value);
                }
            }

            if (current_result_key_values.length > 1) {
                result.push({
                    [key]: And(...current_result_key_values)
                })
            } else {
                result.push({
                    [key]: current_result_key_values[0]
                })
            }
        }
    } else {
        result = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (obj[key]) {
                    let object_value_to_analyse = obj[key];
                    if (!Array.isArray(object_value_to_analyse)) {
                        object_value_to_analyse = [object_value_to_analyse];
                    }

                    const current_result_key_values = [];
                    for (let value of object_value_to_analyse) {
                        if (typeof value == "string") {
                            if (key == "id") {
                                current_result_key_values.push(Like("%" + value.replace(/[%_]/g, '\\$&')));
                            } else if (key == "created_at" || key == "updated_at") {
                                const date = new Date(value) as any;

                                // If date is NaN return the object as it is
                                if (isNaN(date)) {
                                    current_result_key_values.push(value);
                                } else {
                                    current_result_key_values.push(date);
                                }
                            } else {
                                current_result_key_values.push(value);
                            }
                        } else if (Array.isArray(value) && key == "tags") { // Only works with the column tags
                            const tagsString = `{${value.join(',')}}`;
                            current_result_key_values.push(Raw(alias => `${alias} @> :tags`, { tags: tagsString }));
                        } else if (typeof value == "object") {
                            let final_value = value?.value;
                            if (key == "created_at" || key == "updated_at") {
                                const date = new Date(final_value) as any;

                                // If date is NaN return the object as it is
                                if (!isNaN(date)) {
                                    final_value = date;
                                }
                            }

                            if (value?.find_operator == "ILike") {
                                final_value = ILike(final_value);
                            } else if (value?.find_operator == "Like") {
                                final_value = Like(final_value);
                            } else if (value?.find_operator == "LessThan") {
                                final_value = LessThan(final_value);
                            } else if (value?.find_operator == "LessThanOrEqual") {
                                final_value = LessThanOrEqual(final_value);
                            } else if (value?.find_operator == "MoreThan") {
                                final_value = MoreThan(final_value);
                            } else if (value?.find_operator == "MoreThanOrEqual") {
                                final_value = MoreThanOrEqual(final_value);
                            }

                            current_result_key_values.push(final_value);
                        } else {
                            current_result_key_values.push(value);
                        }
                    }

                    if (current_result_key_values.length > 1) {
                        result[key] = And(...current_result_key_values)
                    } else {
                        result[key] = current_result_key_values[0];
                    }
                }
            }
        }
    }

    return result;
}

export const mergeUniqueArrays = <T>(array1: T[], array2: T[]): T[] => {
    const combinedArray = [...array1, ...array2];
    const uniqueArray = Array.from(new Set(combinedArray));
    return uniqueArray;
};

type BlogCategory = {
    id: string;
    name: string;
}

export const separateBlogsScript = (objects: BlogCategory[] ) => {
    function isEnglishName(name) {
        return /^[a-zA-Z\s]+$/.test(name);
    }

    const englishCategories = objects.filter(obj => isEnglishName(obj.name));
    const arabicCategories = objects.filter(obj => !isEnglishName(obj.name));

    return {
        englishCategories, arabicCategories
    };
}