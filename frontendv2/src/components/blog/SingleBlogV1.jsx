import { Link } from 'react-router-dom';
import Animation from '../animation/Animation';

const SingleBlogV1 = ({ blog }) => {
    const { id, thumb, date, tag, title, btnText, animationDelay } = blog

    return (
        <>
            <Animation className='animate__animated animate__fadeInUp' delay={animationDelay}>
                <div className="home-blog-style-one-item">
                    <div className="home-blog-thumb">
                        <Link to={`/blog-single-with-sidebar/${id}`}>
                            <img src={`/assets/img/blog/${thumb}`} alt="Thumb" />
                        </Link>
                        <ul className="home-blog-meta">
                            <li>
                                <Link to="#">{tag}</Link>
                            </li>
                            <li>{date}</li>
                        </ul>
                    </div>
                    <div className="content">
                        <div className="info">
                            <h4 className="blog-title">
                                <Link to={`/blog-single-with-sidebar/${id}`}>{title}</Link>
                            </h4>
                            <Link to={`/blog-single-with-sidebar/${id}`} className="btn-read-more">{btnText} <i className="fas fa-long-arrow-right" /></Link>
                        </div>
                    </div>
                </div>
            </Animation>
        </>
    );
};

export default SingleBlogV1;