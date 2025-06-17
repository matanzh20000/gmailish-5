const FloatingCircles = () => (
  <>
    <div
      style={{
        position: 'absolute',
        top: -40,
        right: -40,
        width: 120,
        height: 120,
        background: 'radial-gradient(circle, #2575fc 30%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(45px)',
        opacity: 0.3,
        animation: 'float 6s ease-in-out infinite',
      }}
    />
    <div
      style={{
        position: 'absolute',
        bottom: -50,
        left: -50,
        width: 100,
        height: 100,
        background: 'radial-gradient(circle, #6a11cb 40%, transparent 60%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        opacity: 0.2,
        animation: 'floatReverse 8s ease-in-out infinite',
      }}
    />
    <style>
      {`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(15px); }
        }
        @keyframes floatReverse {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}
    </style>
  </>
);

export default FloatingCircles;