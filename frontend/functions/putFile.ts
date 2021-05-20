const putFile = async (url:string, file:File, mime:string) => {
    try {
        await fetch(url, {
          method: 'PUT',
          headers: {
            contentType: mime
          },
          body: file
        });
      } catch (error) {
        console.error(error);
      }
}

export default putFile;