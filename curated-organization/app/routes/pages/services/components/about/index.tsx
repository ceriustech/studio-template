import React from 'react';
import './about.css';
import napoCircularLogo from '~/assets/napo-circular-logo.png';
import napoTitleLogo from '~/assets/napo-title-logo.png';
import ceoImage from '~/assets/ceo_img_2.png';

const About = () => {
	let imgUrl =
		'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=1000&q=80&auto=format';

	return (
		<section className="aboutBrief">
			<div className="aboutBriefImg">
				<img
					src={ceoImage}
					alt="Rina, Founder and Lead Curator"
					className="aboutBriefPhoto"
					fetchPriority="high"
				/>
				{/* <div className="aboutBriefImgOverlay" /> */}
			</div>
			<div className="aboutBriefText">
				<p className="sectionEyebrow">About Curated</p>
				<h2>Where order meets elegance</h2>
				<p>
					Based in the DMV, Curated offers dedicated, highly personalized
					professional organizing. Grounded in 15 years of ER nursing precision
					and a degree in psychology, we view clutter as neurological friction
					that drains your daily energy. Whether you prefer a seamless,
					hands-off transformation or direct collaboration, we turn chaotic home
					and office environments into tailored, relapse-proof
					sanctuaries—delivering the ultimate feeling of relief and clarity that
					comes with true Consolidation Therapy.
				</p>
				<div className="aboutSignature">— Rina, Founder and Lead Curator</div>
				<div className="aboutLogos">
					<div className="aboutLogoItem">
						<p className="aboutLogoLabel">CPO Certified</p>
						<img
							src={napoCircularLogo}
							alt="The Board of Certification for Professional Organizers"
							width={40}
							height={40}
						/>
					</div>
					<div className="aboutLogoItem">
						<p className="aboutLogoLabel">NAPO Member</p>
						<img
							src={napoTitleLogo}
							alt="NAPO — National Association of Productivity and Organizing Professionals member"
							width={80}
							height={50}
						/>
					</div>
				</div>
			</div>
		</section>
	);
};

export default About;
