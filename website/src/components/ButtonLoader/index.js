import ClipLoader from 'react-spinners/ClipLoader';

export default function ButtonLoader({
  loading,
  loadingText,
  idleText,
  onClick,
  disabled,
}) {
  if (loading) {
    return (
      <div className="btn btn-secondary disabled pr-3">
        {loadingText}&nbsp;
        <ClipLoader size={15} />
      </div>
    );
  } else if (disabled) {
    return (
      <div className="btn btn-secondary disabled pr-3">
        {idleText}
      </div>
    );
  }

  const props = {
    className: 'btn btn-secondary',
  };

  if (onClick) {
    props.onClick = onClick;
  } else {
    props.type = 'submit';
  }

  return <button {...props}>{idleText}</button>;
}
