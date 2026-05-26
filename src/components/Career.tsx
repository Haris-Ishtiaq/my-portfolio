import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>

          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Team Lead / Principal Engineer</h4>
                <h5>Programmers Force (SHUFTI)</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              Leading development of key Shufti modules — Age Verification, VJB
              (Journey Builder), and BBV (Behavioral Biometrics). Managing
              sprint planning, task allocation, and daily leadership of the
              engineering team. Overseeing production deployments with zero
              production errors, acting as the bridge between Product, SQA, and
              Engineering.
            </p>
          </div>

          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Senior Software Engineer</h4>
                <h5>Vaival Technologies</h5>
              </div>
              <h3>2023–25</h3>
            </div>
            <p>
              Spearheaded a remote team of 5 developers in the CareCart product
              line delivering Shopify-based SaaS features used by 2,000+
              customers. Delivered Jaiza App module 2 weeks ahead of schedule,
              enhancing efficiency by 25% and reducing QA feedback loops by 30%.
              Optimized reporting engine with Redis caching — 30% faster data
              retrieval. Led RnD on Gadget.dev, migrating 3 apps from PHP to
              MERN stack.
            </p>
          </div>

          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Senior Full Stack Developer</h4>
                <h5>OnyxTec</h5>
              </div>
              <h3>2021–23</h3>
            </div>
            <p>
              Orchestrated a hybrid team of 6 developers across 8 major web
              application projects, ensuring 100% on-time delivery. Architected
              scalable Laravel backends and led sprint planning for 100+ feature
              releases. Trained and mentored 6 junior developers, accelerating
              onboarding by 40%. Delivered expertise in Pusher API, Stripe, and
              Twilio integrations.
            </p>
          </div>

          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Full Stack Developer</h4>
                <h5>Solution Summit</h5>
              </div>
              <h3>2020–21</h3>
            </div>
            <p>
              Delivered a comprehensive system with 10+ modules and real-time
              analytics accessed by 500+ users. Integrated Stripe, Instagram,
              PayPal, Authorize.net, and Twilio APIs. Implemented caching layers
              reducing response times by 22%. Built applications using
              CodeIgniter and Laravel.
            </p>
          </div>

          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>PHP Developer</h4>
                <h5>InventorX Technologies</h5>
              </div>
              <h3>2019–20</h3>
            </div>
            <p>
              Developed and launched 6 ERP systems used by over 15 client
              businesses. Built iEMS test scheduling management module with
              reports and graphical dashboards. Developed and debugged the iPOS
              system using Laravel, improving performance and reliability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
