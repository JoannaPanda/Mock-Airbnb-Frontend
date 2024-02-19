
/**
 * Given a js file object representing a jpg or png image, such as one taken
 * from a html file input element, return a promise which resolves to the file
 * data as a data url.
 * More info:
 *   https://developer.mozilla.org/en-US/docs/Web/API/File
 *   https://developer.mozilla.org/en-US/docs/Web/API/FileReader
 *   https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
 *
 * Example Usage:
 *   const file = document.querySelector('input[type="file"]').files[0];
 *   console.log(fileToDataUrl(file));
 * @param {File} file The file to be read.
 * @return {Promise<string>} Promise which resolves to the file as a data url.
 */
export function fileToDataUrl (file) {
  const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const valid = validFileTypes.find((type) => type === file.type);
  // Bad data, let's walk away.
  if (!valid) {
    throw Error('provided file is not a png, jpg or jpeg image.');
  }

  const reader = new FileReader();
  const dataUrlPromise = new Promise((resolve, reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
  });
  reader.readAsDataURL(file);
  return dataUrlPromise;
}

// Reference: inspired by https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
export const extractYoutubeVideoId = (url) => {
  const youtubeRegexString =
    '.*(?:youtu.be/|v/|u/\\w/|embed/|watch\\?v=)([^#\\&\\?]*).*';
  const youtubeRegex = new RegExp(youtubeRegexString);
  const match = url.match(youtubeRegex);
  return match ? match[1] : null;
};

export const calculateBookingLength = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const timeDifference = endDate - startDate;
  const nights = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  return nights;
};

// format DateObject to DD/MM/YYYY or YYYY-MM-DD
export const formatDate = (dateObject, format) => {
  let formattedDateString = null;

  // Extract day, month, and year from the DateObject
  const day = dateObject.$D;
  const month = dateObject.$M + 1;
  const year = dateObject.$y;
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;
  if (format) {
    // Construct the formatted string
    formattedDateString = `${formattedDay}/${formattedMonth}/${year}`;
  } else {
    formattedDateString = `${year}-${formattedMonth}-${formattedDay}`;
  }

  return formattedDateString;
};
