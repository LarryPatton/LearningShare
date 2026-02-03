export function Footer() {
  return (
    <footer className="border-t mt-20" style={{ 
      borderColor: 'var(--color-border)',
      backgroundColor: 'var(--color-bg-secondary)'
    }}>
      <div className="container-wide py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            © {new Date().getFullYear()} Learning Share. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            <span>分享知识，记录成长</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
