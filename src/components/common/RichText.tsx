import React from 'react';

interface RichTextProps {
  text: string;
  className?: string;
}

/**
 * Parses *word* to <em className="accent">word</em> and plain words.
 */
function renderInlineAccents(str: string): React.ReactNode[] {
  const parts = str.split(/(\*[^*]+\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      const clean = part.slice(1, -1);
      return (
        <em key={index} className="accent not-italic">
          {clean}
        </em>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

/**
 * Accent component for section titles and headers.
 * Converts '|' to line breaks (<br/>) and '*word*' to <em className="accent">word</em>.
 */
export const Accent: React.FC<RichTextProps> = ({ text, className = '' }) => {
  if (!text) return null;
  const lines = text.split('|');

  return (
    <span className={className}>
      {lines.map((line, idx) => (
        <React.Fragment key={idx}>
          {renderInlineAccents(line)}
          {idx < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </span>
  );
};

/**
 * Headline component for banner titles.
 * Wraps each line in <span className="line"><span className="line-in">...</span></span>
 * to enable cropped upward reveal animation.
 */
export const Headline: React.FC<RichTextProps> = ({ text, className = '' }) => {
  if (!text) return null;
  const lines = text.split('|');

  return (
    <span className={className}>
      {lines.map((line, idx) => (
        <span key={idx} className="line">
          <span className="line-in">{renderInlineAccents(line)}</span>
        </span>
      ))}
    </span>
  );
};

/**
 * ManifestoWords splits text into individual word spans
 * so words can light up sequentially on scroll.
 */
export const ManifestoWords: React.FC<RichTextProps> = ({ text, className = '' }) => {
  if (!text) return null;
  const words = text.split(/\s+/);

  return (
    <span className={className}>
      {words.map((word, idx) => (
        <span key={idx} className="w inline-block mr-1.5 transition-colors duration-300">
          {renderInlineAccents(word)}
        </span>
      ))}
    </span>
  );
};
