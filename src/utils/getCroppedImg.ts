export const getCroppedImg = async (imageSrc: string, crop: any) => {
    const image = new Image();
    image.src = imageSrc;
  
    return new Promise<string>((resolve, reject) => {
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');
  
        if (ctx) {
          ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
          );
  
          canvas.toBlob(blob => {
            if (blob) {
              const fileUrl = URL.createObjectURL(blob);
              resolve(fileUrl);
            } else {
              reject(new Error('Canvas is empty'));
            }
          }, 'image/jpeg');
        } else {
          reject(new Error('Could not get canvas context'));
        }
      };
  
      image.onerror = (error) => reject(error);
    });
  };
  