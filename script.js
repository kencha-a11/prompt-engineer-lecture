 // Global variables
        let currentExample = 0;
        const totalExamples = 5;
        let isGenerating = false;

        // Initialize page
        document.addEventListener('DOMContentLoaded', function() {
            initializeCarousel();
            initializeProgressTracker();
            loadSavedTheme();
            loadFormData();
            
            // Hide loading overlay
            setTimeout(() => {
                document.getElementById('loadingOverlay').classList.remove('active');
            }, 1000);
        });

        // FIXED: Theme toggle with proper icons
        function toggleTheme() {
            const body = document.body;
            const themeToggle = document.getElementById('themeToggle');
            const isDark = body.getAttribute('data-theme') === 'dark';
            
            if (isDark) {
                body.removeAttribute('data-theme');
                themeToggle.innerHTML = '🌙';
                themeToggle.title = 'Switch to Dark Mode';
                localStorage.setItem('theme', 'light');
            } else {
                body.setAttribute('data-theme', 'dark');
                themeToggle.innerHTML = '☀️';
                themeToggle.title = 'Switch to Light Mode';
                localStorage.setItem('theme', 'dark');
            }
        }

        // Load saved theme
        function loadSavedTheme() {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                document.body.setAttribute('data-theme', 'dark');
                document.getElementById('themeToggle').innerHTML = '☀️';
                document.getElementById('themeToggle').title = 'Switch to Light Mode';
            }
        }

        // FIXED: Section toggle functionality for collapsible sections
        function toggleSection(sectionName) {
            const section = document.getElementById(`${sectionName}-section`);
            const allSections = document.querySelectorAll('.section');
            const allTabs = document.querySelectorAll('.nav-tab');
            
            // Remove active class from all tabs
            allTabs.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked tab
            const clickedTab = event.target.closest('.nav-tab') || 
                              Array.from(allTabs).find(tab => tab.textContent.toLowerCase().includes(sectionName));
            if (clickedTab) {
                clickedTab.classList.add('active');
            }
            
            if (section.classList.contains('expanded')) {
                // Collapse the section
                section.classList.remove('expanded');
                section.classList.add('collapsed');
            } else {
                // Collapse all other sections
                allSections.forEach(s => {
                    s.classList.remove('expanded');
                    s.classList.add('collapsed');
                });
                
                // Expand the clicked section
                section.classList.remove('collapsed');
                section.classList.add('expanded');
                
                // Smooth scroll to section
                setTimeout(() => {
                    section.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100);
            }
        }

        // Prompt generator
        function generatePrompt() {
            const context = document.getElementById('context').value;
            const objective = document.getElementById('objective').value;
            const style = document.getElementById('style').value;
            const tone = document.getElementById('tone').value;
            const audience = document.getElementById('audience').value;
            const response = document.getElementById('response').value;
            const steps = document.getElementById('steps').value;
            
            if (!context || !objective) {
                showToast('Please fill in at least Context and Objective fields', 'error');
                return;
            }
            
            const generatedPrompt = `You are ${style || 'an expert assistant'}.

Context:
${context}

Objective:
${objective}

${style ? `Style/Role: ${style}` : ''}
${tone ? `Tone: ${tone}` : ''}
${audience ? `Audience: ${audience}` : ''}
${response ? `Response Format: ${response}` : ''}
${steps ? `Steps/Constraints:\n${steps}` : ''}

Please provide a comprehensive response that addresses all requirements above.`;

            const promptContainer = document.getElementById('generatedPrompt');
            promptContainer.textContent = generatedPrompt;
            promptContainer.style.display = 'block';
            
            // Smooth scroll to generated prompt
            promptContainer.scrollIntoView({ behavior: 'smooth' });
            
            showToast('✨ Prompt generated successfully!', 'success');
        }

        // Carousel functionality
        function initializeCarousel() {
            const indicators = document.getElementById('carouselIndicators');
            indicators.innerHTML = ''; // Clear existing indicators
            for (let i = 0; i < totalExamples; i++) {
                const indicator = document.createElement('div');
                indicator.className = `indicator ${i === 0 ? 'active' : ''}`;
                indicator.onclick = () => goToExample(i);
                indicators.appendChild(indicator);
            }
        }

        function nextExample() {
            currentExample = (currentExample + 1) % totalExamples;
            updateCarousel();
        }

        function previousExample() {
            currentExample = (currentExample - 1 + totalExamples) % totalExamples;
            updateCarousel();
        }

        function goToExample(index) {
            currentExample = index;
            updateCarousel();
        }

        function updateCarousel() {
            const track = document.getElementById('carouselTrack');
            const indicators = document.querySelectorAll('.indicator');
            
            if (track) {
                track.style.transform = `translateX(-${currentExample * 100}%)`;
            }
            
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentExample);
            });
        }

        // Auto-advance carousel
        setInterval(() => {
            const examplesSection = document.getElementById('examples-section');
            if (examplesSection && examplesSection.classList.contains('expanded')) {
                nextExample();
            }
        }, 10000);

        // Copy to clipboard functionality
        function copyToClipboard(button) {
            const codeBlock = button.closest('.code-block');
            const preElement = codeBlock.querySelector('pre');
            const text = preElement.textContent;
            
            navigator.clipboard.writeText(text).then(() => {
                const originalText = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check"></i> Copied!';
                button.style.background = 'var(--success)';
                
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.style.background = 'var(--primary)';
                }, 2000);
            }).catch(() => {
                showToast('Failed to copy to clipboard', 'error');
            });
        }

        // FIXED: Enhanced progress tracker with visual progress bar
        function initializeProgressTracker() {
            const progressFill = document.getElementById('progressFill');
            const progressText = document.getElementById('progressText');
            
            window.addEventListener('scroll', () => {
                const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = Math.min((winScroll / height) * 100, 100);
                
                if (progressFill && progressText) {
                    progressFill.style.width = scrolled + '%';
                    progressText.textContent = Math.round(scrolled) + '%';
                }
            });
        }

        // Toast notification system
        function showToast(message, type = 'success') {
            const toast = document.getElementById('toast');
            if (!toast) return;
            
            toast.textContent = message;
            toast.className = `toast show ${type}`;
            
            if (type === 'error') {
                toast.style.background = 'var(--danger)';
            } else {
                toast.style.background = 'var(--success)';
            }
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }

        // Advanced PDF generation
        function generateAdvancedPDF() {
            if (isGenerating) return;
            
            isGenerating = true;
            const loadingOverlay = document.getElementById('loadingOverlay');
            loadingOverlay.classList.add('active');
            
            // Simulate processing time for better UX
            setTimeout(() => {
                try {
                    const { jsPDF } = window.jspdf;
                    const doc = new jsPDF();
                    
                    // Set up styling
                    doc.setFont("helvetica");
                    let yPosition = 20;
                    const pageHeight = doc.internal.pageSize.height;
                    const margin = 20;
                    const lineHeight = 7;
                    
                    function addText(text, fontSize, isBold = false, color = [0, 0, 0]) {
                        if (yPosition > pageHeight - 30) {
                            doc.addPage();
                            yPosition = 20;
                        }
                        
                        doc.setFontSize(fontSize);
                        doc.setTextColor(color[0], color[1], color[2]);
                        doc.setFont("helvetica", isBold ? "bold" : "normal");
                        
                        const splitText = doc.splitTextToSize(text, 170);
                        doc.text(splitText, margin, yPosition);
                        yPosition += splitText.length * lineHeight + 3;
                    }
                    
                    function addSection(title, content, isExample = false) {
                        yPosition += 5;
                        addText(title, 14, true, isExample ? [16, 185, 129] : [99, 102, 241]);
                        yPosition += 3;
                        
                        if (Array.isArray(content)) {
                            content.forEach(item => {
                                if (item === "") {
                                    yPosition += 3;
                                } else {
                                    addText(item, 10);
                                }
                            });
                        } else {
                            addText(content, 10);
                        }
                        yPosition += 8;
                    }
                    
                    // Cover page
                    addText("🚀 PROMPT ENGINEERING MASTERCLASS", 20, true, [99, 102, 241]);
                    yPosition += 5;
                    addText("Complete Interactive Guide to AI Communication", 14, false, [100, 100, 100]);
                    yPosition += 10;
                    addText("TABLE OF CONTENTS", 16, true, [75, 75, 75]);
                    yPosition += 5;
                    
                    const toc = [
                        "Part 1: Foundations & Core Principles",
                        "Part 2: Advanced Crafting Techniques", 
                        "Part 3: C.O.S.T.A.R.S Framework",
                        "Part 4: Chain-of-Thought & Advanced Methods",
                        "Part 5: Real-World Examples Library",
                        "Part 6: Quality Assurance & Best Practices",
                        "Part 7: Common Pitfalls & Solutions",
                        "Part 8: Building Your Prompt Library",
                        "Appendix: Quick Reference Cards"
                    ];
                    
                    toc.forEach((item, index) => {
                        addText(`${index + 1}. ${item}`, 11);
                    });
                    
                    doc.addPage();
                    yPosition = 20;
                    
                    // Main content sections
                    addSection("🔥 PART 1: FOUNDATIONS", [
                        "What is a Prompt?",
                        "A prompt is strategic input (instructions + context) designed to guide Large Language Models toward producing specific, high-quality responses.",
                        "",
                        "Core Principles:",
                        "• Clarity: Be specific about desired outcomes",
                        "• Context: Provide necessary background information", 
                        "• Structure: Organize prompts logically",
                        "• Examples: Show the model what good output looks like",
                        "",
                        "Key Formula: AI + Human Creativity = Exceptional Results"
                    ]);
                    
                    addSection("🎨 PART 2: ADVANCED CRAFTING TECHNIQUES", [
                        "The KISS Principle: Keep It Simple & Structured",
                        "Think of prompting like cooking - you need the right ingredients (context), clear recipe steps (instructions), and iterative refinement (testing).",
                        "",
                        "Professional Approach:",
                        "1. Draft your initial prompt using proven frameworks",
                        "2. Test with your target model and collect outputs", 
                        "3. Analyze results for format, tone, and accuracy",
                        "4. Refine by adding examples, constraints, and personas",
                        "5. Repeat until you achieve consistent high-quality results",
                        "",
                        "Remember: Generic prompts lead to generic answers. Well-organized inputs produce exceptional outputs."
                    ]);
                    
                    addSection("📋 PART 3: C.O.S.T.A.R.S FRAMEWORK", [
                        "The ultimate prompt structure for professional results:",
                        "",
                        "C - CONTEXT: Background information and scope",
                        "O - OBJECTIVE: Clear goal or specific task", 
                        "S - STYLE/ROLE: Persona or expertise level needed",
                        "T - TONE: Communication style (professional, casual, etc.)",
                        "A - AUDIENCE: Who will consume this content",
                        "R - RESPONSE: Desired output format",
                        "S - STEPS: Specific constraints or process requirements"
                    ]);
                    
                    // Add examples on new pages
                    doc.addPage();
                    yPosition = 20;
                    
                    addSection("💡 PROFESSIONAL EXAMPLES", [], true);
                    
                    const examples = [
                        {
                            title: "Business Strategy Example",
                            content: `You are a Senior Product Manager at a Fortune 500 tech company.

Context: AI-powered project management tool for remote teams
Market: North America & Europe, companies 50-500 employees

Objective: Create comprehensive product brief with features, KPIs, pain points, and go-to-market strategy

Style: Executive-level, data-driven
Audience: C-level executives and investors
Format: Executive Summary, Features & KPIs table, Market Analysis
Constraints: Under 2 pages, include 3+ market statistics`
                        },
                        {
                            title: "Educational Content Example",
                            content: `You are an experienced math tutor specializing in calculus.

Context: Student struggling with derivative applications
Problem: Ball thrown upward, find maximum height

Instructions:
1. Show all work step-by-step
2. Explain reasoning behind each step  
3. Use simple language for high school student
4. Include verification and real-world interpretation

Teaching Style: Patient, encouraging, methodical`
                        }
                    ];
                    
                    examples.forEach((example, index) => {
                        if (index > 0) {
                            yPosition += 10;
                        }
                        addText(`Example ${index + 1}: ${example.title}`, 12, true, [16, 185, 129]);
                        yPosition += 5;
                        addText(example.content, 9);
                    });
                    
                    doc.addPage();
                    yPosition = 20;
                    
                    addSection("✅ QUALITY ASSURANCE CHECKLIST", [
                        "Master Quality Checklist:",
                        "□ Clarity: Is the objective crystal clear and unambiguous?",
                        "□ Context: Have you provided sufficient background information?", 
                        "□ Role: Is the AI persona/expertise level specified?",
                        "□ Audience: Is the target audience clearly defined?",
                        "□ Format: Is the desired output format explicitly requested?",
                        "□ Examples: Are there 1-3 high-quality examples provided?",
                        "□ Constraints: Are limitations and requirements specified?",
                        "□ Logic: Is chain-of-thought requested for complex reasoning?",
                        "□ Validation: Have you tested with multiple inputs?",
                        "□ Documentation: Is this saved in your reusable library?"
                    ]);
                    
                    // Add footer to each page
                    const totalPages = doc.internal.getNumberOfPages();
                    for (let i = 1; i <= totalPages; i++) {
                        doc.setPage(i);
                        doc.setFontSize(8);
                        doc.setTextColor(128, 128, 128);
                        doc.text(`Page ${i} of ${totalPages}`, 105, 287, { align: 'center' });
                        doc.text('🚀 Prompt Engineering Masterclass | Professional Guide', 105, 295, { align: 'center' });
                    }
                    
                    // Save the PDF
                    doc.save("Prompt_Engineering_Masterclass_Complete.pdf");
                    
                    showToast('📄 PDF generated successfully! Check your downloads folder.', 'success');
                    
                } catch (error) {
                    console.error('PDF generation error:', error);
                    showToast('Error generating PDF. Please try again.', 'error');
                }
                
                loadingOverlay.classList.remove('active');
                isGenerating = false;
            }, 2000);
        }

        // Technique detail tooltips
        function showTechniqueDetail(technique) {
            const techniques = {
                skeleton: {
                    title: "Skeleton of Thought",
                    description: "Create a basic structure first, then progressively fill in details. Perfect for complex documents and comprehensive analyses."
                },
                tree: {
                    title: "Tree of Thought", 
                    description: "Explore multiple reasoning paths simultaneously. Ideal for complex problem-solving with multiple viable solutions."
                },
                meta: {
                    title: "Meta-Prompting",
                    description: "Create prompts that help generate better prompts. Meta-level thinking for prompt optimization."
                },
                persona: {
                    title: "Multi-Persona",
                    description: "Have multiple experts collaborate on a single problem. Brings diverse perspectives to complex challenges."
                },
                least: {
                    title: "Least-to-Most",
                    description: "Break complex problems into progressively simpler sub-problems. Build solutions bottom-up."
                },
                stepback: {
                    title: "Step-Back Prompting", 
                    description: "Ask broader, higher-level questions to gain better perspective before diving into specifics."
                }
            };
            
            const tech = techniques[technique];
            if (tech) {
                showToast(`💡 ${tech.title}: ${tech.description}`, 'success');
            }
        }

        // Auto-save form data
        function loadFormData() {
            const formInputs = ['context', 'objective', 'style', 'tone', 'audience', 'response', 'steps'];
            formInputs.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    // Load saved data
                    const saved = localStorage.getItem(`prompt_${id}`);
                    if (saved) {
                        element.value = saved;
                    }
                    
                    // Auto-save on input
                    element.addEventListener('input', () => {
                        localStorage.setItem(`prompt_${id}`, element.value);
                    });
                }
            });
        }

        // Smooth scrolling for internal links
        document.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' && e.target.getAttribute('href') && e.target.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(e.target.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'd':
                        e.preventDefault();
                        generateAdvancedPDF();
                        break;
                    case 't':
                        e.preventDefault();
                        toggleTheme();
                        break;
                }
            }
        });

        // Handle section expansion/collapse with smooth animations
        document.addEventListener('DOMContentLoaded', function() {
            const sections = document.querySelectorAll('.section');
            sections.forEach(section => {
                const content = section.querySelector('.section-content');
                if (content) {
                    if (section.classList.contains('expanded')) {
                        content.style.maxHeight = content.scrollHeight + 'px';
                    } else {
                        content.style.maxHeight = '0px';
                    }
                }
            });
        });

        // Update section expansion animation
        const originalToggleSection = toggleSection;
        toggleSection = function(sectionName) {
            const section = document.getElementById(`${sectionName}-section`);
            const content = section.querySelector('.section-content');
            const allSections = document.querySelectorAll('.section');
            const allTabs = document.querySelectorAll('.nav-tab');
            
            // Remove active class from all tabs
            allTabs.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked tab
            const clickedTab = event.target.closest('.nav-tab') || 
                              Array.from(allTabs).find(tab => tab.textContent.toLowerCase().includes(sectionName));
            if (clickedTab) {
                clickedTab.classList.add('active');
            }
            
            if (section.classList.contains('expanded')) {
                // Collapse the section
                content.style.maxHeight = '0px';
                section.classList.remove('expanded');
                section.classList.add('collapsed');
            } else {
                // Collapse all other sections
                allSections.forEach(s => {
                    const otherContent = s.querySelector('.section-content');
                    if (otherContent) {
                        otherContent.style.maxHeight = '0px';
                    }
                    s.classList.remove('expanded');
                    s.classList.add('collapsed');
                });
                
                // Expand the clicked section
                section.classList.remove('collapsed');
                section.classList.add('expanded');
                content.style.maxHeight = content.scrollHeight + 'px';
                
                // Smooth scroll to section
                setTimeout(() => {
                    section.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100);
            }
        };
