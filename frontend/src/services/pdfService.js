export const uploadPdf = async (file) => {
  const formData = new FormData();
  formData.append('pdf', file);
  
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/upload-pdf`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: formData
  });
  
  if (!response.ok) {
    throw new Error('Failed to upload PDF');
  }
  
  const data = await response.json();
  return data.text;
};