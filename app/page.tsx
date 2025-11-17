import Link from "next/link";
import Image from "next/image";
import RoughButton from "./components/RoughButton";
import RoughBox from "./components/RoughBox";

export default function Home() {
  return (
    <div className="page-container peach-bg">
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        padding: '40px'
      }}>
        <div style={{ position: 'relative', width: '90%', maxWidth: '1200px', minHeight: '80vh' }}>
          <RoughBox
            fillColor="#F4D6A0"
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '80px',
              position: 'relative',
              overflow: 'visible'
            }}
          >
            <h1 className="game-title" style={{ alignSelf: 'flex-start' }}>
              <span className="title-line" style={{ fontSize: '140px' }}>Hedgie</span>
              <span className="title-line" style={{ fontSize: '100px', marginTop: '10px' }}>Number</span>
              <span className="title-line" style={{ fontSize: '70px' }}>Dash</span>
            </h1>
            <div style={{ 
              position: 'absolute',
              top: '50%',
              right: '-50px',
              transform: 'translateY(-50%)'
            }}>
              <Image 
                src="/images/img_hedgehog.png" 
                alt="Hedgehog"
                width={800}
                height={800}
                style={{ objectFit: 'contain', transform: 'scaleX(-1) translateY(-120px)' }}
              />
            </div>
            <div style={{ 
              display: 'flex', 
              gap: '30px', 
              marginTop: '20px',
              marginBottom: '40px',
              justifyContent: 'center',
              width: '100%'
            }}>
              <Link href="/customize" style={{ textDecoration: 'none' }}>
                <RoughButton className="btn-green btn-large">
                  Start
                </RoughButton>
              </Link>
              <Link href="/instructions" style={{ textDecoration: 'none' }}>
                <RoughButton className="btn-yellow btn-large">
                  How to play
                </RoughButton>
              </Link>
            </div>
          </RoughBox>
          <div style={{
            position: 'absolute',
            bottom: '40px',
            left: '110px',
            fontFamily: 'Virgil, cursive',
            fontSize: '18px',
            fontWeight: 700,
            color: '#2C3E50'
          }}>
            © Hedgie Game Studio
          </div>
        </div>
      </div>
    </div>
  );
}
