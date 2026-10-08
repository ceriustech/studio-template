import React, { useState } from 'react';
import { Link } from 'react-router';
import type { BeforeAfterProps } from './BeforeAfter.types';
import './beforeAfter.css';

type BeforeAfterKey = 'before' | 'after';

type FallbackState = Record<BeforeAfterKey, boolean>;

const BeforeAfter: React.FC<BeforeAfterProps> = ({
	eyebrow,
	heading,
	before,
	after,
	caption,
	link,
}) => {
	const [fallback, setFallback] = useState<FallbackState>({
		before: false,
		after: false,
	});

	const items = [
		{ key: 'before', tag: 'Before', image: before },
		{ key: 'after', tag: 'After', image: after },
	] as const;

	const handleImageError = (key: BeforeAfterKey) => {
		setFallback((prev) => ({ ...prev, [key]: true }));
	};

	return (
		<section className="beforeAfter">
			<div className="baHeader">
				{eyebrow && <p className="sectionEyebrow">{eyebrow}</p>}
				<h2 className="sectionHeading">{heading}</h2>
			</div>
			<div className="baContainer">
				<div className="baPair">
					{items.map(({ key, tag, image }) => (
						<Link
							key={key}
							to="/gallery"
							aria-label={`View full gallery — ${tag}`}
							className={`baCell ${fallback[key] ? 'baCellPlaceholder' : ''}`}
							style={
								!fallback[key]
									? {
											backgroundImage: `url('${image.src}')`,
											backgroundPosition: image.position,
										}
									: undefined
							}
						>
							{fallback[key] ? (
								<div
									className="baCellFallback"
									role="img"
									aria-label={`${tag} image unavailable`}
								>
									<p>{tag} image unavailable</p>
								</div>
							) : (
								<img
									className="srOnly"
									src={image.src}
									alt={image.alt}
									onError={() => handleImageError(key)}
								/>
							)}
							<span className="baTag">{tag}</span>
						</Link>
					))}
				</div>
				{caption && <p className="baCaption">{caption}</p>}
				{link && (
					<div className="baFooter">
						<Link className="textLink" to={link.url}>
							{link.label} <span aria-hidden="true">→</span>
						</Link>
					</div>
				)}
			</div>
		</section>
	);
};

export default BeforeAfter;
