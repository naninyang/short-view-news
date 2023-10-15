import axios from 'axios';
import React, { useState } from 'react';

function ContactForm() {
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    created: new Date().toISOString(),
    description: '',
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, formData);

      if (response.status === 200) {
        alert('성공적으로 제출되었습니다!');
      } else {
        console.log('오류가 발생했습니다: ' + response.data.error);
      }
    } catch (error) {
      console.error('오류 발생:', error);
      console.log('오류가 발생했습니다.');
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br />
      <div>
        <label>
          제목:
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </label>
      </div>
      <div>
        <label>
          이름:
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </label>
      </div>
      <input
        type="hidden"
        value={formData.created}
        onChange={(e) => setFormData({ ...formData, created: e.target.value })}
      />
      <div>
        <label>
          설명:
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </label>
      </div>
      <button type="submit">제출</button>
    </form>
  );
}

export default ContactForm;
