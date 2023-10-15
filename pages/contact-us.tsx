import React, { useState } from 'react';
import axios from 'axios';
import Seo from '@/components/Seo';
import styles from '@/styles/contact.module.sass';

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

  const timestamp = Date.now();

  return (
    <main className={styles.contact_us}>
      <Seo
        pageTitle="문의사항"
        pageDescription="당신이 놓친 뉴스를 짧게 요약해 드려요"
        pageImg={`https://news.dev1stud.io/og-image.png?ts=${timestamp}`}
      />
      <div className={styles['contact_us-content']}>
        <h1>
          <span>문의사항 Contact Us.</span>
        </h1>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend>문의 질의</legend>
            <input
              type="hidden"
              value={formData.created}
              onChange={(e) => setFormData({ ...formData, created: e.target.value })}
            />
            <div className={styles['field-group']}>
              <label htmlFor="title">제목</label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className={styles['field-group']}>
              <label htmlFor="name">이름</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className={styles['field-group']}>
              <label htmlFor="description">내용</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <button type="submit">문의하기</button>
          </fieldset>
        </form>
      </div>
    </main>
  );
}

export default ContactForm;
