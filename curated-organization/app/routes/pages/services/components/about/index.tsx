import React from 'react';
import './about.css';
import type { AboutProps } from './About.types';

const About: React.FC<AboutProps> = ({ eyebrow, heading, bio, signature, photo, badges }) => {
	const header = (
		<>
			{eyebrow && <p className="sectionEyebrow">{eyebrow}</p>}
			<h2 className="aboutBriefTitle">{heading}</h2>
		</>
	);

	return (
		<section className="aboutBrief">
			<div className="aboutBriefImg">
				<div className="aboutBriefHeaderMobile">{header}</div>
				<img
					src={photo.src}
					alt={photo.alt}
					width={photo.width}
					height={photo.height}
					className="aboutBriefPhoto"
					fetchPriority="high"
				/>
				{/* <div className="aboutBriefImgOverlay" /> */}
			</div>
			<div className="aboutBriefText">
				<div className="aboutBriefHeaderDesktop">{header}</div>
				<p>{bio}</p>
				{signature && <div className="aboutSignature">{signature}</div>}
				<div className="aboutLogos">
					{badges.map((badge, index) => (
						<div className="aboutLogoItem" key={index}>
							{badge.label && <p className="aboutLogoLabel">{badge.label}</p>}
							<img
								src={badge.image.src}
								alt={badge.image.alt}
								width={badge.image.width}
								height={badge.image.height}
							/>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default About;
