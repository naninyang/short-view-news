import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styled from '@emotion/styled';
import Seo from '@/components/Seo';
import AnchorLink from '@/components/AnchorLink';
import { images } from '@/images';
import content from '@/styles/content.module.sass';
import styles from '@/styles/contact.module.sass';

type DataResponse = {
  description: string;
};

const BackButton = styled.i({
  display: 'block',
  'body[data-theme="dark"] &': {
    background: `url(${images.arrow.backLight}) no-repeat 50% 50%/contain`,
  },
  'body &, body[data-theme="light"] &': {
    background: `url(${images.arrow.backDark}) no-repeat 50% 50%/contain`,
  },
});

function ContactForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    email: '',
    created: new Date().toISOString(),
    description: '',
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, formData);

      if (response.status === 200) {
        alert('성공적으로 제출되었습니다!');
        router.push('/');
      } else {
        console.log('오류가 발생했습니다: ' + response.data.error);
      }
    } catch (error) {
      console.error('오류 발생:', error);
      console.log('오류가 발생했습니다.');
    }
  };

  const [data, setData] = useState<DataResponse | null>(null);
  const title = 'ContactUs';

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`/api/pages?title=${title}`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching page info:', error);
      }
    }
    fetchData();
  }, [title]);

  const [currentPage, setCurrentPage] = useState<string | null>(null);

  useEffect(() => {
    const storedPage = localStorage.getItem('currentPage');
    setCurrentPage(storedPage);
  }, []);

  const timestamp = Date.now();

  return (
    <main className={`${content.content} ${styles.contact_us}`}>
      <Seo
        pageTitle="문의사항"
        pageDescription="당신이 놓친 뉴스를 짧게 요약해 드려요"
        pageImg={`https://news.dev1stud.io/og-image.png?ts=${timestamp}`}
      />
      <div className="top-link">
        {currentPage ? (
          <AnchorLink href={`/${currentPage}`}>
            <BackButton />
            <span>뒤로가기</span>
          </AnchorLink>
        ) : (
          <AnchorLink href="/">
            <BackButton />
            <span>뒤로가기</span>
          </AnchorLink>
        )}
      </div>
      <div className={styles['contact_us-content']}>
        <h1>
          <span>문의사항 Contact Us.</span>
        </h1>
        {data && <div dangerouslySetInnerHTML={{ __html: data.description }} />}
        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend>문의 질의</legend>
            <input
              required
              type="hidden"
              value={formData.created}
              onChange={(e) => setFormData({ ...formData, created: e.target.value })}
            />
            <div className={styles['field-group']}>
              <label htmlFor="title">제목</label>
              <input
                required
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className={styles['field-group']}>
              <label htmlFor="name">이름</label>
              <input
                required
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className={styles['field-group']}>
              <label htmlFor="email">이메일</label>
              <input
                required
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className={styles['field-group']}>
              <label htmlFor="description">내용</label>
              <textarea
                required
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
