import React, { useState } from 'react';
import { Link } from 'react-router';
import './beforeAfter.css';

const beforeAfterItems = [
	{
		key: 'before',
		tag: 'Before' as const,
		src: 'https://plus.unsplash.com/premium_photo-1683141147002-f3543aa988eb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		alt: 'Before view of master closet transformation in Arlington, Virginia',
	},
	{
		key: 'after',
		tag: 'After' as const,
		src: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=900&q=80&auto=format',
		alt: 'After view of master closet transformation with custom storage systems',
	},
] as const;

type BeforeAfterKey = (typeof beforeAfterItems)[number]['key'];

type FallbackState = Record<BeforeAfterKey, boolean>;

const BeforeAfter: React.FC = () => {
	const [fallback, setFallback] = useState<FallbackState>({
		before: false,
		after: false,
	});

	const handleImageError = (tag: BeforeAfterKey) => {
		const key = tag.toLowerCase() as 'before' | 'after';
		setFallback((prev) => ({ ...prev, [key]: true }));
	};

	return (
		<section className="beforeAfter">
			<div className="baHeader">
				<p className="sectionEyebrow">The transformation</p>
				<h2 className="sectionHeading">See the difference</h2>
			</div>
			<div className="baContainer">
				<div className="baPair">
					{beforeAfterItems.map((item) => {
						const key = item.key;
						return (
							<Link
								key={item.key}
								to="/gallery"
								aria-label={`View full gallery — ${item.tag}`}
								className={`baCell ${fallback[key] ? 'baCellPlaceholder' : ''}`}
								style={
									!fallback[key]
										? { backgroundImage: `url('${item.src}')` }
										: undefined
								}
							>
								{fallback[key] ? (
									<div
										className="baCellFallback"
										role="img"
										aria-label={`${item.tag} image unavailable`}
									>
										<p>{item.tag} image unavailable</p>
									</div>
								) : (
									<img
										className="srOnly"
										src={item.src}
										alt={item.alt}
										onError={() => handleImageError(item.key)}
									/>
								)}
								<span className="baTag">{item.tag}</span>
							</Link>
						);
					})}
				</div>
				<p className="baCaption">
					Master closet transformation — Arlington, VA. Complete reorganization
					with custom storage systems, labeled bins, and seasonal rotation.
				</p>
				<div className="baFooter">
					<Link className="textLink" to="/gallery">
						View full gallery →
					</Link>
				</div>
			</div>
		</section>
	);
};

export default BeforeAfter;
