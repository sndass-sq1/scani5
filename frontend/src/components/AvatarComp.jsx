import TooltipComp from './TooltipComp';

const avatar_classes = ['', 'avatar-green', 'avatar-yellow', 'more-avatar'];

const AvatarComp = ({ list, clickFn, disabled }) => {
    return (
        <div className="avatar-group-container">
            {list?.length > 0 &&
                list?.map(
                    (val, index) =>
                        index <= 2 &&
                        (val === null ? (
                            <img
                                src="/images/user.png"
                                className={`avatar-content cursor-pointer ${disabled ? 'avatar-disable' : ''}`}
                                key={`${val}_avatar_${index}`}
                                onClick={clickFn}
                                alt="user-avatar"
                            />
                        ) : (
                            // <TooltipComp position="top" content={val}>
                            <div
                                className={`avatar-content text-up cursor-pointer ${avatar_classes[index]} ${disabled ? 'avatar-disable' : ''}`}
                                onClick={clickFn}
                                key={`${val}_avatar_${index}`}>
                                {val?.charAt(0)}
                            </div>
                            // </TooltipComp>
                        ))
                )}
            {list?.length > 3 && (
                <div
                    className={`avatar-content cursor-pointer more-avatar  ${disabled ? 'avatar-disable' : ''}`}
                    onClick={clickFn}
                    key={`more_avatar`}>
                    +{list?.length - 3}
                </div>
            )}
        </div>
    );
};

export default AvatarComp;
