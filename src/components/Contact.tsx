import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>

        <div className="contact-flex">
          <div className="contact-box">
            <h4>Connect</h4>
            <p>
              <a
                href="https://linkedin.com/in/haris-ishtiaq-6302461a9"
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
              >
                LinkedIn — haris-ishtiaq-6302461a9
              </a>
            </p>
            <h4>Education</h4>
            <p>
              BS Software Engineering<br />
              Superior University — Gold Campus, Lahore<br />
              Oct 2016 – Jun 2020
            </p>
            <h4>Location</h4>
            <p>Lahore, Punjab, Pakistan</p>
          </div>

          <div className="contact-box">
            <h4>Social</h4>
            <a
              href="https://linkedin.com/in/haris-ishtiaq-6302461a9"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              LinkedIn <MdArrowOutward />
            </a>
            <a
              href="https://github.com/haris-ishtiaq"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              GitHub <MdArrowOutward />
            </a>
            <a
              href="mailto:haris.i.chughtai@gmail.com"
              data-cursor="disable"
              className="contact-social"
            >
              Email <MdArrowOutward />
            </a>
            <a
              href="/Haris_Ishtiaq_Resume.pdf"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Resume PDF <MdArrowOutward />
            </a>
          </div>

          <div className="contact-box">
            <h2>
              Designed &amp; Developed <br /> by{" "}
              <span>Haris Ishtiaq</span>
            </h2>
            <h5>
              <MdCopyright /> 2026
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
