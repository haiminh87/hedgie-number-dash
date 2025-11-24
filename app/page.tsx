import Link from "next/link";
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
        padding: '20px'
      }}>
        <div style={{
          position: 'relative',
          width: '1000px',
          height: '750px'
        }}>
          <RoughBox
            fillColor="transparent"
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'visible',
              backgroundImage: 'url(/images/home_background.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div style={{ height: '170px' }} />
            <div style={{
              display: 'flex',
              gap: '30px',
              justifyContent: 'center'
            }}>
              <Link href="/grade-level" style={{ textDecoration: 'none' }}>
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
