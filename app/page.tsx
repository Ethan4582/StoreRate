"use client";
import { motion, useInView } from "framer-motion"
import { useRef, useEffect } from "react";
import { HeroSection } from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection"
import { ReviewsSection } from "@/components/ReviewsSection";
import { BarChart3, Shield, Star, ThumbsUp, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import HowItWorksSection from "@/components/HowItWorksSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";

const storeReviews = [
	{
		id: "1",
		storeName: "FreshMart Grocery",
		location: "Downtown, New York",
		rating: 4.7,
		reviews: 284,
		category: "Grocery",
		description:
			"Best place for fresh produce and organic products. Their customer service is exceptional!",
		user: {
			name: "Sarah Johnson",
			role: "Regular Customer",
			img: "/1.png",
		},
	},
	{
		id: "2",
		storeName: "TechGadgets",
		location: "Silicon Valley, CA",
		rating: 4.9,
		reviews: 512,
		category: "Electronics",
		description:
			"Amazing selection of tech products with competitive prices. Knowledgeable staff and great warranty options.",
		user: {
			name: "Mike Chen",
			role: "Tech Enthusiast",
			img: "/2.png",
		},
	},
	{
		id: "3",
		storeName: "FashionHub Boutique",
		location: "Beverly Hills, CA",
		rating: 4.5,
		reviews: 187,
		category: "Clothing",
		description:
			"Trendy fashion with quality materials. Their seasonal sales are absolutely worth waiting for!",
		user: {
			name: "Emily Rodriguez",
			role: "Fashion Blogger",
			img: "/3.png",
		},
	},
	{
		id: "4",
		storeName: "HomeEssentials",
		location: "Seattle, WA",
		rating: 4.8,
		reviews: 346,
		category: "Home Goods",
		description:
			"Everything you need for your home at reasonable prices. Their delivery service is fast and reliable.",
		user: {
			name: "David Kim",
			role: "Homeowner",
			img: "/4.png",
		},
	},
];

const platformStats = [
	{ value: "50K+", label: "Active Users" },
	{ value: "10K+", label: "Rated Stores" },
	{ value: "100K+", label: "Reviews" },
	{ value: "95%", label: "Satisfaction Rate" },
];

const features = [
	{
		title: "Authentic Reviews",
		description: "Real customer experiences from verified purchases",
		icon: <ThumbsUp className="h-8 w-8" />,
	},
	{
		title: "Detailed Ratings",
		description: "Rate stores on multiple criteria for comprehensive evaluation",
		icon: <BarChart3 className="h-8 w-8" />,
	},
	{
		title: "Trustworthy Community",
		description: "Join a community of honest reviewers and store owners",
		icon: <Users className="h-8 w-8" />,
	},
	{
		title: "Secure Platform",
		description: "Your data and privacy are our top priority",
		icon: <Shield className="h-8 w-8" />,
	},
];

const fadeIn = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const staggerContainer = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.2,
		},
	},
};

const scaleUp = {
	hidden: { opacity: 0, scale: 0.9 },
	visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

function AnimateWhenVisible({ children }: { children: React.ReactNode }) {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });

	return (
		<motion.div
			ref={ref}
			initial="hidden"
			animate={isInView ? "visible" : "hidden"}
			variants={fadeIn}
		>
			{children}
		</motion.div>
	);
}

function ReviewCard({ review }: { review: typeof storeReviews[0] }) {
	return (
		<Card className="h-full hover:shadow-lg transition-all duration-300">
			<CardHeader className="pb-3">
				<div className="flex justify-between items-start">
					<div>
						<CardTitle className="text-lg">{review.storeName}</CardTitle>
						<CardDescription className="mt-1">
							{review.location} • {review.category}
						</CardDescription>
					</div>
					<div className="flex items-center bg-primary/10 px-2 py-1 rounded-full">
						<Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
						<span className="text-sm font-medium">{review.rating}</span>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className="flex items-center mb-4">
					{[...Array(5)].map((_, i) => (
						<Star
							key={i}
							className={`h-4 w-4 ${
								i < Math.floor(review.rating)
									? "fill-yellow-400 text-yellow-400"
									: "text-gray-300"
							}`}
						/>
					))}
					<span className="text-sm text-muted-foreground ml-2">
						({review.reviews} reviews)
					</span>
				</div>
				<p className="text-muted-foreground mb-4 italic">
					"{review.description}"
				</p>
				<div className="flex items-center">
					<div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
						<span className="text-sm font-medium text-primary">
							{review.user.name.split(" ").map((n) => n[0]).join("")}
						</span>
					</div>
					<div>
						<p className="text-sm font-medium">{review.user.name}</p>
						<p className="text-xs text-muted-foreground">
							{review.user.role}
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export default function HomePage() {
	const featuresRef = useRef<HTMLDivElement>(null);

	const scrollToFeatures = () => {
		featuresRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
			anchor.addEventListener("click", function (e) {
				e.preventDefault();
				const target = document.querySelector(this.getAttribute("href"));
				if (target) {
					window.scrollTo({
						top: target.offsetTop - 80,
						behavior: "smooth",
					});
				}
			});
		});
	}, []);

	return (
		<div className="overflow-hidden">
			<HeroSection
				platformStats={platformStats}
				scrollToFeatures={scrollToFeatures}
			/>
			<FeaturesSection features={features} featuresRef={featuresRef} />
			<ReviewsSection storeReviews={storeReviews}  />
			<HowItWorksSection />
			<TestimonialsSection />
			<CTASection />
		</div>
	);
}