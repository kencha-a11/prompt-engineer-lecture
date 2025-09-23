// Global variables
let currentExample = 0;
const totalExamples = 3;
let isGenerating = false;
let sectionProgress = {
    foundations: false,
    crafting: false,
    advanced: false,
    examples: false,
    tools: false
};

// Prompt examples data
const promptExamples = {
    business: {
        context: "Fortune 500 technology company launching a new SaaS product targeting mid-market enterprises. Current market research shows 40% growth in cloud adoption among target demographic.",
        objective: "Create a comprehensive go-to-market strategy presentation for the executive team, including market analysis, competitive positioning, pricing strategy, and 12-month launch timeline.",
        style: "Senior Business Strategy Consultant with 15+ years experience in SaaS market entries",
        tone: "Professional, data-driven, confident with actionable insights",
        audience: "C-level executives, VPs of Sales and Marketing, Board members",
        response: "Executive presentation format with slides outline, key talking points, supporting data requirements, and appendix recommendations",
        steps: "1. Include market size analysis with TAM/SAM/SOM\n2. Competitor analysis with feature comparison matrix\n3. Pricing strategy with 3 tier options\n4. Launch timeline with key milestones\n5. Success metrics and KPIs for each quarter"
    },
    creative: {
        context: "Independent author working on a science fiction novel set in 2157 where humans have colonized Mars. The story explores themes of identity, belonging, and what makes us human in an age of genetic modification and AI consciousness.",
        objective: "Write compelling character development arcs for three main protagonists: a Mars-born engineer questioning their Earth heritage, an AI seeking legal personhood, and an Earth diplomat navigating interplanetary politics.",
        style: "Award-winning science fiction author known for character-driven narratives and philosophical depth",
        tone: "Thoughtful, emotionally resonant, with subtle complexity and layered meaning",
        audience: "Adult science fiction readers who appreciate both hard sci-fi concepts and deep character exploration",
        response: "Detailed character profiles with backstories, motivation drivers, character arcs, key relationship dynamics, and pivotal character moments throughout the narrative",
        steps: "1. Create detailed backstories for each character\n2. Define core motivations and internal conflicts\n3. Map character growth arcs across story timeline\n4. Develop key relationships and how they evolve\n5. Identify 3-4 pivotal moments for each character\n6. Ensure thematic coherence with overall narrative"
    },
    technical: {
        context: "Open-source JavaScript library for real-time data visualization used by 50,000+ developers. Recent v3.0 release includes breaking changes, new WebGL rendering engine, and enhanced accessibility features.",
        objective: "Create comprehensive migration guide documentation helping developers upgrade from v2.x to v3.0, including code examples, troubleshooting common issues, and best practices for performance optimization.",
        style: "Senior Technical Writer specializing in developer documentation with expertise in JavaScript frameworks and data visualization",
        tone: "Clear, helpful, technically accurate while remaining accessible to developers of varying experience levels",
        audience: "JavaScript developers, data scientists, and technical teams already using v2.x who need to upgrade",
        response: "Structured technical documentation with table of contents, step-by-step migration process, before/after code examples, troubleshooting section, and FAQ",
        steps: "1. Overview of breaking changes with impact assessment\n2. Step-by-step migration checklist\n3. Code transformation examples with before/after comparisons\n4. Common migration issues and solutions\n5. Performance optimization recommendations\n6. Testing strategies for upgraded implementations"
    },
    educational: {
        context: "High school AP Biology class studying cellular respiration. Students have already covered basic cell structure and are now learning about energy metabolism. Next week's lab involves measuring oxygen consumption in germinating seeds.",
        objective: "Create an engaging lesson plan that explains the electron transport chain and ATP synthesis in a way that connects to the upcoming lab experiment, includes interactive elements, and helps students visualize this complex biochemical process.",
        style: "Experienced AP Biology teacher known for making complex concepts accessible and connecting theory to hands-on experiments",
        tone: "Enthusiastic, encouraging, with clear explanations that build student confidence in tackling challenging scientific concepts",
        audience: "16-18 year old AP Biology students with foundational knowledge of cell biology but new to detailed biochemistry",
        response: "Complete lesson plan with learning objectives, step-by-step teaching sequence, interactive activities, visual aids description, assessment questions, and lab connection points",
        steps: "1. Hook activity connecting to students' everyday experience with energy\n2. Visual explanation of electron transport chain using analogies\n3. Interactive activity modeling ATP synthesis\n4. Connection to upcoming seed respiration lab\n5. Formative assessment with immediate feedback\n6. Preview of next lesson on photosynthesis comparison"
    }
};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeCarousel();
    initializeSectionProgress();
    loadSavedTheme();
    loadFormData();
    
    // Mark foundations as read initially
    markSectionAsRead('foundations');
    
    // Hide loading overlay
    setTimeout(() => {
        document.getElementById('loadingOverlay').classList.remove('active');
    }, 1000);
});

// Theme toggle with proper icons
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    const isDark = body.getAttribute('data-theme') === 'dark';
    
    if (isDark) {
        body.removeAttribute('data-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.title = 'Switch to Dark Mode';
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        themeToggle.title = 'Switch to Light Mode';
        localStorage.setItem('theme', 'dark');
    }
}

// Load saved theme
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"></i>';
        document.getElementById('themeToggle').title = 'Switch to Light Mode';
    }
}

// Enhanced section progress tracking
function initializeSectionProgress() {
    updateProgressDisplay();
}

function markSectionAsRead(sectionName) {
    sectionProgress[sectionName] = true;
    updateProgressDisplay();
    localStorage.setItem('sectionProgress', JSON.stringify(sectionProgress));
}

function updateProgressDisplay() {
    const dots = document.querySelectorAll('.section-dot');
    const progressText = document.getElementById('progressText');
    let completedCount = 0;
    let currentSection = null;

    Object.keys(sectionProgress).forEach((section, index) => {
        const dot = dots[index];
        if (sectionProgress[section]) {
            dot.classList.add('completed');
            dot.classList.remove('current');
            completedCount++;
        } else if (!currentSection) {
            dot.classList.add('current');
            dot.classList.remove('completed');
            currentSection = section;
        } else {
            dot.classList.remove('completed', 'current');
        }
    });

    progressText.textContent = `${completedCount}/5`;
}

// Load saved progress
const savedProgress = localStorage.getItem('sectionProgress');
if (savedProgress) {
    sectionProgress = JSON.parse(savedProgress);
}

// Section toggle with progress tracking
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

    // Mark section as read
    markSectionAsRead(sectionName);
    
    if (section.classList.contains('expanded')) {
        // Collapse the section
        const content = section.querySelector('.section-content');
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
        const content = section.querySelector('.section-content');
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
}

// Load example into form
function loadExample(exampleType) {
    const example = promptExamples[exampleType];
    if (!example) return;

    // Remove selected class from all options
    document.querySelectorAll('.example-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selected class to clicked option
    event.target.closest('.example-option').classList.add('selected');

    // Fill form fields
    document.getElementById('context').value = example.context;
    document.getElementById('objective').value = example.objective;
    document.getElementById('style').value = example.style;
    document.getElementById('tone').value = example.tone;
    document.getElementById('audience').value = example.audience;
    document.getElementById('response').value = example.response;
    document.getElementById('steps').value = example.steps;

    showToast(`✨ ${exampleType.charAt(0).toUpperCase() + exampleType.slice(1)} example loaded!`, 'success');
}

// Clear form function
function clearForm() {
    const formInputs = ['context', 'objective', 'style', 'tone', 'audience', 'response', 'steps'];
    formInputs.forEach(id => {
        document.getElementById(id).value = '';
        localStorage.removeItem(`prompt_${id}`);
    });
    
    // Remove selected class from all examples
    document.querySelectorAll('.example-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Hide generated prompt
    document.getElementById('generatedPrompt').style.display = 'none';
    
    showToast('🗑️ All fields cleared!', 'success');
}

// Enhanced prompt generator
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
    const promptText = document.getElementById('generatedPromptText');
    promptText.textContent = generatedPrompt;
    promptContainer.style.display = 'block';
    
    // Smooth scroll to generated prompt
    promptContainer.scrollIntoView({ behavior: 'smooth' });
    
    showToast('✨ Prompt generated successfully!', 'success');
}

// Copy generated prompt function
function copyGeneratedPrompt() {
    const promptText = document.getElementById('generatedPromptText').textContent;
    const copyBtn = document.getElementById('copyGeneratedBtn');
    
    navigator.clipboard.writeText(promptText).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        copyBtn.style.background = 'var(--success)';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.style.background = 'var(--primary)';
        }, 2000);
        
        showToast('📋 Prompt copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Failed to copy to clipboard', 'error');
    });
}

// Carousel functionality
function initializeCarousel() {
    const indicators = document.getElementById('carouselIndicators');
    indicators.innerHTML = '';
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
}, 8000);

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

// Toast notification system
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Enhanced PDF generation with proper encoding
function generateAdvancedPDF() {
    if (isGenerating) return;
    
    isGenerating = true;
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.classList.add('active');
    
    setTimeout(() => {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('p', 'mm', 'a4');
            
            // Set up fonts and encoding
            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            
            let yPosition = 20;
            const pageHeight = doc.internal.pageSize.height;
            const margin = 20;
            const lineHeight = 6;
            const pageWidth = doc.internal.pageSize.width;
            const contentWidth = pageWidth - (margin * 2);
            
            function addText(text, fontSize, isBold = false, color = [0, 0, 0]) {
                if (yPosition > pageHeight - 30) {
                    doc.addPage();
                    yPosition = 20;
                }
                
                doc.setFontSize(fontSize);
                doc.setTextColor(color[0], color[1], color[2]);
                doc.setFont("helvetica", isBold ? "bold" : "normal");
                
                // Handle text wrapping properly
                const splitText = doc.splitTextToSize(text, contentWidth);
                doc.text(splitText, margin, yPosition);
                yPosition += (splitText.length * lineHeight) + 2;
            }
            
            function addSection(title, content) {
                yPosition += 5;
                addText(title, 14, true, [99, 102, 241]);
                yPosition += 3;
                
                if (Array.isArray(content)) {
                    content.forEach(item => {
                        if (item === "") {
                            yPosition += 3;
                        } else {
                            addText(item, 10);
                        }
                    });
                } else if (content) {
                    addText(content, 10);
                }
                yPosition += 5;
            }
            
            // Title page
            addText("PROMPT ENGINEERING MASTERCLASS", 18, true, [99, 102, 241]);
            yPosition += 5;
            addText("Complete Guide to AI Communication", 12, false, [100, 100, 100]);
            yPosition += 15;
            
            // Table of contents
            addText("TABLE OF CONTENTS", 14, true, [75, 75, 75]);
            yPosition += 5;
            
            const toc = [
                "1. Foundations & Core Principles",
                "2. Prompt Crafting Mastery", 
                "3. Advanced Techniques",
                "4. Real-World Examples",
                "5. Tools & Best Practices"
            ];
            
            toc.forEach(item => {
                addText(item, 11);
            });
            
            doc.addPage();
            yPosition = 20;
            
            // Content sections
            addSection("1. FOUNDATIONS", [
                "What is a Prompt?",
                "A prompt is strategic input designed to guide Large Language Models toward producing specific, high-quality responses.",
                "",
                "Core Principles:",
                "- Clarity: Be specific about desired outcomes",
                "- Context: Provide necessary background information", 
                "- Structure: Organize prompts logically",
                "- Examples: Show the model what good output looks like",
                "",
                "Key Formula: AI + Human Creativity = Exceptional Results"
            ]);
            
            addSection("2. PROMPT CRAFTING MASTERY", [
                "The KISS Principle: Keep It Simple & Structured",
                "",
                "C.O.S.T.A.R.S Framework:",
                "C - Context: Background information and scope",
                "O - Objective: Clear goal or specific task", 
                "S - Style/Role: Persona or expertise level needed",
                "T - Tone: Communication style",
                "A - Audience: Who will consume this content",
                "R - Response: Desired output format",
                "S - Steps: Specific constraints or process requirements"
            ]);
            
            addSection("3. ADVANCED TECHNIQUES", [
                "Chain-of-Thought (CoT):",
                "Ask the model to show intermediate reasoning steps for complex tasks.",
                "",
                "Advanced Methods:",
                "- Tree of Thought: Explore multiple reasoning paths",
                "- Skeleton of Thought: Create structure first, fill details later",
                "- Meta-Prompting: Create prompts that generate better prompts",
                "- Multi-Persona: Have multiple experts collaborate",
                "- Least-to-Most: Break complex problems into simpler parts"
            ]);
            
            addSection("4. QUALITY ASSURANCE", [
                "Master Checklist:",
                "- Clear objective and context provided",
                "- AI persona/expertise level specified",
                "- Target audience clearly defined",
                "- Desired output format explicitly requested",
                "- High-quality examples included",
                "- Constraints and requirements specified",
                "- Chain-of-thought for complex reasoning",
                "- Tested with multiple inputs",
                "- Saved in reusable library"
            ]);
            
            // Add page numbers
            const totalPages = doc.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(128, 128, 128);
                doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
            }
            
            // Save the PDF
            doc.save("Prompt_Engineering_Masterclass_Guide.pdf");
            showToast('PDF generated successfully! Check your downloads.', 'success');
            
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
        skeleton: "Skeleton of Thought: Create basic structure first, then fill in details progressively. Perfect for complex documents.",
        tree: "Tree of Thought: Explore multiple reasoning paths simultaneously. Ideal for complex problem-solving.",
        meta: "Meta-Prompting: Create prompts that help generate better prompts. Meta-level optimization.",
        persona: "Multi-Persona: Have multiple experts collaborate on a single problem. Diverse perspectives.",
        least: "Least-to-Most: Break complex problems into simpler sub-problems. Bottom-up approach.",
        stepback: "Step-Back Prompting: Ask broader questions for better perspective before diving into specifics."
    };
    
    const description = techniques[technique];
    if (description) {
        showToast(description, 'success');
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

// Handle section expansion animations
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