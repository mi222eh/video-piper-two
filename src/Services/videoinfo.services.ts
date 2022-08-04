import { filter, sortBy } from "lodash";
import { Acodec, Format, IVideoInfo } from "../VideoInfo";

export const doesFormatHaveAudio = (format: Format) => {
    return format.acodec !== Acodec.None;
};

export const doesFormatHaveVideo = (format: Format) => {
    return format.vcodec !== "none";
};

export const doesFormatHaveVideoAndAudio = (format: Format) => {
    return doesFormatHaveAudio(format) && doesFormatHaveVideo(format);
};

export const getAllVideoFormats = (info: IVideoInfo) => {
    const formats = info.formats?.filter((x) => doesFormatHaveVideo(x)) ?? [];
    return sortFormatVideoList(formats);
};

export const hasVideoFormatAudio = (info: IVideoInfo, formatId: string) => {
    const formats = getAllAudioFormats(info);
    return formats.findIndex((f) => f.format_id === formatId) > -1;
};

export const hasVideoFormatVideo = (info: IVideoInfo, formatId: string) => {
    const formats = getAllVideoFormats(info);
    return formats.findIndex((f) => f.format_id === formatId) > -1;
};

export const getOnlyVideoFormats = (info: IVideoInfo) => {
    const formats =
        info.formats?.filter(
            (x) => doesFormatHaveVideo(x) && !doesFormatHaveAudio(x)
        ) ?? [];
    return sortFormatVideoList(formats);
};

export const getAllAudioFormats = (info: IVideoInfo) => {
    const formats = info.formats?.filter((x) => doesFormatHaveAudio(x));
    return sortBy(formats, (x) => x.filesize);
};

export const getOnlyAudioFormats = (info: IVideoInfo) => {
    const formats = info.formats?.filter(
        (x) => doesFormatHaveAudio(x) && !doesFormatHaveVideo(x)
    );
    return sortBy(formats, (x) => x.filesize);
};

export const getMixedFormats = (info: IVideoInfo) => {
    const formats = info.formats?.filter(
        (x) => doesFormatHaveVideo(x) && doesFormatHaveVideo(x)
    );
    return sortBy(formats, (x) => x.filesize);
};

export const getFormatVideoWidth = (format: Format) => {
    return format.width ?? NaN;
};

export const getFormatVideoHeight = (format: Format) => {
    return format.height ?? NaN;
};

export const getFormatVideoFPS = (format: Format) => {
    return format.fps ?? NaN;
};

export const get4K60Formats = (info: IVideoInfo) => {
    const formatList = get4KFormats(info);
    let filteredFormatList = filter(
        formatList,
        (format) => getFormatVideoFPS(format) >= 60
    );
    return filteredFormatList;
};

/**
 * Gets sorted 4k formats list, last one is biggest
 */
export const get4KFormats = (info: IVideoInfo) => {
    const formatList = getAllVideoFormats(info);
    let filteredFormatList = filter(
        formatList,
        (format) =>
            getFormatVideoWidth(format) >= 3840 &&
            getFormatVideoHeight(format) <= 4096
    );
    filteredFormatList = sortBy(
        filteredFormatList,
        (f) => getFormatVideoWidth(f) * getFormatVideoHeight(f)
    );
    return filteredFormatList;
};

export const get1080PFormats = (info: IVideoInfo) => {
    const formatList = getAllVideoFormats(info);
    const format = filter(formatList, (x) => getFormatVideoWidth(x) === 1920);
    return format;
};

export const get1080P60Formats = (info: IVideoInfo) => {
    const formatList = get1080PFormats(info);
    const format = filter(formatList, (x) => getFormatVideoFPS(x) >= 60);
    return format;
};

export const doesVideoHave4K = (info: IVideoInfo) => {
    return get4KFormats(info).length > 0;
};

export const doesVideoHave1080P = (info: IVideoInfo) => {
    return get1080PFormats(info).length > 0;
};

/**Sort the format list (videos) based on amount of pixels*/
export const sortFormatVideoList = (list: Format[]): Format[] => {
    return sortBy(
        list,
        (f) =>
            getFormatVideoHeight(f) * getFormatVideoWidth(f) + (f.filesize ?? 0)
    );
};

// ['4K60']() {
//     const formatList = that.getVideoFormats();
//     let filteredFormatList = _.filter(
//         formatList,
//         format =>
//             format.width >= 3840 &&
//             format.width <= 4096 &&
//             format.fps >= 60
//     );
//     filteredFormatList = _.sortBy(filteredFormatList, a => a.filesize);
//     const format = _.last(filteredFormatList);
//     return format;
// },
// ['4K']() {
//     const formatList = that.getVideoFormats();
//     let filteredFormatList = _.filter(
//         formatList,
//         format =>
//             format.width >= 3840 &&
//             format.width <= 4096 &&
//             format.fps < 60
//     );
//     filteredFormatList = _.sortBy(filteredFormatList, a => a.filesize);
//     const format = _.last(filteredFormatList);
//     return format;
// },
// ['1080p60']() {
//     const formatList = that.getVideoFormats();

//     const format = _.findLast(
//         formatList,
//         x => x.width === 1920 && x.fps >= 60
//     );
//     return format;
// },
// ['1080p']() {
//     const formatList = that.getVideoFormats();

//     const format = _.findLast(
//         formatList,
//         x => x.width === 1920 && x.fps < 60
//     );
//     return format;
// },
// ['720p60']() {
//     const formatList = that.getVideoFormats();

//     const format = _.findLast(
//         formatList,
//         x => x.height > 700 && x.height < 800 && x.fps >= 60
//     );
//     return format;
// },
// ['720p']() {
//     const formatList = that.getVideoFormats();

//     const format = _.findLast(
//         formatList,
//         x => x.height > 700 && x.height < 800 && x.fps < 60
//     );
//     return format;
// },
// ['480p']() {
//     const formatList = that.getVideoFormats();
//     const format = _.findLast(
//         formatList,
//         x => x.height > 400 && x.height < 500
//     );
//     return format;
// },
// ['360p']() {
//     const formatList = that.getVideoFormats();
//     const format = _.findLast(
//         formatList,
//         x => x.height > 300 && x.height < 400
//     );
//     return format;
// },
// audio() {
//     return that.getBestAudioFormat();
// }
