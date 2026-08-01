import React from 'react';
import './about.css';
import napoCircularLogo from '~/assets/napo-circular-logo.png';
import napoTitleLogo from '~/assets/napo-title-logo.png';

const About = () => {
	return (
		<section className="aboutBrief">
			<div
				className="aboutBriefImg"
				style={{
					backgroundImage:
						"url('https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=1000&q=80&auto=format')",
				}}
			>
				<div className="aboutBriefImgOverlay" />
			</div>
			<div className="aboutBriefText">
				<p className="sectionEyebrow">About Curated</p>
				<h2>Where order meets elegance</h2>
				<p>
					Curated is a professional organizing studio serving the NOVA and DMV
					area. We transform cluttered, overwhelming spaces into functional
					sanctuaries — homes and offices that look beautiful and work
					effortlessly for the way you actually live. Every project starts with
					listening, and every system we build is designed to last long after we
					leave.
				</p>
				<div className="aboutSignature">— The Curated Team</div>
				<div className="aboutLogos">
					<div className="aboutLogoItem">
						<p className="aboutLogoLabel">CPO Certified</p>
						<img
							src={napoCircularLogo}
							alt="The Board of Certification for Professional Organizers"
							width={50}
							height={50}
						/>
					</div>
					<div className="aboutLogoItem">
						<p className="aboutLogoLabel">NAPO Member</p>
						<img
							src={napoTitleLogo}
							alt="NAPO — National Association of Productivity and Organizing Professionals member"
							width={85}
							height={50}
						/>
					</div>
				</div>
			</div>
		</section>
	);
};

export default About;
