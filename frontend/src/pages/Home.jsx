import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      <section className="hero">
        <h1>Welcome to ChatBot</h1>
        <p>Your intelligent AI assistant for all your questions</p>
        <Link to="/register" className="btn btn-primary">Get Started</Link>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>🤖 Smart AI</h3>
          <p>Powered by advanced AI technology to answer your questions intelligently</p>
        </div>
        <div className="feature-card">
          <h3>💬 Real-time Chat</h3>
          <p>Engage in natural conversations with our responsive chat interface</p>
        </div>
        <div className="feature-card">
          <h3>🔒 Secure</h3>
          <p>Your conversations are private and secure with end-to-end protection</p>
        </div>
      </section>
    </div>
  )
}

export default Home