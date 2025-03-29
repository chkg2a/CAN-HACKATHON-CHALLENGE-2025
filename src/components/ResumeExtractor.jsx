import React, { useState } from 'react';

const ResumeExtractor = () => {
  const [resumeText, setResumeText] = useState('');
  const [extractedData, setExtractedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // Sample resume for testing
  const sampleResume = `An Gx
123 Example Street, San Francisco, CA 94101
an.gx@email.com
4701165454

EDUCATION
Bachelor of Arts in Design
University of California, 2018-2022
GPA: 3.7/4.0

EXPERIENCE
UX Designer
Tech Innovations Inc., 2022-Present
- Designed user interfaces for mobile applications
- Conducted user research and usability testing
- Created wireframes and prototypes

Design Intern
Creative Studio, 2021-2022
- Assisted senior designers with projects
- Developed branding materials
- Participated in client meetings

SKILLS
Figma, Adobe Creative Suite, User Research, Prototyping, HTML/CSS`;

  // Improved regex patterns for better performance and accuracy
  const regexPatterns = {
    // Better name detection - looks for 1-3 capitalized words at the beginning of a line
    name: /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})$/m,
    // Standard email pattern
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/i,
    // Improved phone detection for various formats
    phone: /(?:\+?1[-. ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})/,
    // Improved section header detection
    sectionHeader: /^(EDUCATION|EXPERIENCE|SKILLS|QUALIFICATIONS|WORK HISTORY|TECHNICAL SKILLS|COMPETENCIES|PROJECTS|CERTIFICATIONS)(?:\s|:|\n)/im,
    // Bullet points with better capture
    bulletPoints: /^\s*[•\-*]\s*(.+)$/gm,
    // Skill separators for parsing skills lists
    skillSeparators: /[,;]|\s+[-–—]\s+|\s{2,}|\t/,
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    setError('');

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        setResumeText(e.target.result);
      } catch (err) {
        setError('Failed to read file: ' + err.message);
      } finally {
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setError('Error reading file');
      setIsProcessing(false);
    };

    reader.readAsText(file);
  };

  const handleTextInput = (e) => {
    setResumeText(e.target.value);
  };

  const extractInformation = (text) => {
    setIsProcessing(true);
    setError('');

    try {
      const extractedInfo = {
        fullName: extractName(text),
        email: extractEmail(text),
        phone: extractPhone(text),
        education: extractEducation(text),
        experience: extractExperience(text),
        skills: extractSkills(text),
      };

      setExtractedData(extractedInfo);
    } catch (err) {
      console.error('Extraction error:', err);
      setError('Error extracting data: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const extractName = (text) => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    
    // First approach: Look for name pattern in first 3 lines
    for (let i = 0; i < Math.min(3, lines.length); i++) {
      const nameMatch = lines[i].match(regexPatterns.name);
      if (nameMatch && nameMatch[1]) {
        return nameMatch[1].trim();
      }
      
      // Alternative approach: Look for 1-3 capitalized words
      if (/^([A-Z][a-z]+(\s+[A-Z][a-z]+){0,2})$/.test(lines[i])) {
        return lines[i];
      }
    }
    
    // Fallback: Check if first line has capital letters and no numbers
    const firstLine = lines[0] || '';
    if (firstLine && /^[A-Z]/.test(firstLine) && !/\d/.test(firstLine) && firstLine.length < 40) {
      return firstLine;
    }
    
    return 'Not found';
  };

  const extractEmail = (text) => {
    const match = text.match(regexPatterns.email);
    return match ? match[0] : 'Not found';
  };

  const extractPhone = (text) => {
    const match = text.match(regexPatterns.phone);
    if (match) {
      // Format phone number as (XXX) XXX-XXXX if we have all parts
      if (match[1] && match[2] && match[3]) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
      }
      return match[0];
    }
    
    // Try to find a 10-digit number
    const digitMatch = text.match(/\b\d{10}\b/);
    if (digitMatch) {
      const num = digitMatch[0];
      return `(${num.substring(0, 3)}) ${num.substring(3, 6)}-${num.substring(6)}`;
    }
    
    return 'Not found';
  };

  const findSectionBoundaries = (text, sectionName) => {
    const aliases = {
      education: ['education', 'academic', 'qualifications', 'degrees'],
      experience: ['experience', 'employment', 'work history', 'professional experience'],
      skills: ['skills', 'technical skills', 'competencies', 'expertise'],
    };
    
    const lines = text.split('\n');
    let sectionStart = -1;
    let sectionEnd = lines.length;
    
    // Get all section headers in the document
    const sectionHeaders = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line === '') continue;
      
      const headerMatch = line.match(/^([A-Z][A-Z\s]+)(?:\:|\s*$)/);
      if (headerMatch) {
        sectionHeaders.push({ index: i, name: headerMatch[1].trim().toLowerCase() });
      }
    }
    
    // Find our target section
    for (let i = 0; i < sectionHeaders.length; i++) {
      const header = sectionHeaders[i];
      if (aliases[sectionName].some(alias => header.name.includes(alias.toLowerCase()))) {
        sectionStart = header.index + 1;
        
        // Find the next section
        if (i < sectionHeaders.length - 1) {
          sectionEnd = sectionHeaders[i + 1].index;
        }
        
        break;
      }
    }
    
    if (sectionStart === -1) return { start: -1, end: -1 };
    return { start: sectionStart, end: sectionEnd };
  };

  const extractSection = (text, sectionName) => {
    const { start, end } = findSectionBoundaries(text, sectionName);
    
    if (start === -1) return '';
    
    const lines = text.split('\n');
    return lines.slice(start, end).filter(line => line.trim()).join('\n');
  };

  const extractEducation = (text) => {
    const educationSection = extractSection(text, 'education');
    if (!educationSection) return ['Not found'];
    
    // Parse education into logical groups
    const educationItems = [];
    let currentItem = [];
    
    educationSection.split('\n').forEach((line, index, lines) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;
      
      // New education entry typically starts with a degree or university name
      if (index > 0 && (
          /^[A-Z]/.test(trimmedLine) && 
          !trimmedLine.startsWith('-') && 
          !trimmedLine.startsWith('•') &&
          !/^\d{4}/.test(trimmedLine)
        )) {
        if (currentItem.length > 0) {
          educationItems.push(currentItem.join(' '));
          currentItem = [];
        }
      }
      
      currentItem.push(trimmedLine);
    });
    
    if (currentItem.length > 0) {
      educationItems.push(currentItem.join(' '));
    }
    
    return educationItems.length > 0 ? educationItems : ['Not found'];
  };

  const extractExperience = (text) => {
    const experienceSection = extractSection(text, 'experience');
    if (!experienceSection) return ['Not found'];
    
    // Parse experience into logical groups (job positions)
    const experienceItems = [];
    let currentItem = [];
    let inBulletPoints = false;
    
    experienceSection.split('\n').forEach((line, index, lines) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;
      
      // Check if this is a bullet point
      const isBullet = /^\s*[•\-*]/.test(trimmedLine);
      
      // New job entry usually starts with a job title
      if (index > 0 && !isBullet && !inBulletPoints && 
          /^[A-Z]/.test(trimmedLine) && 
          !/^\d{4}/.test(trimmedLine)) {
        if (currentItem.length > 0) {
          experienceItems.push(currentItem.join('\n'));
          currentItem = [];
        }
        inBulletPoints = false;
      }
      
      if (isBullet) {
        inBulletPoints = true;
      }
      
      currentItem.push(trimmedLine);
    });
    
    if (currentItem.length > 0) {
      experienceItems.push(currentItem.join('\n'));
    }
    
    return experienceItems.length > 0 ? experienceItems : ['Not found'];
  };

  const extractSkills = (text) => {
    const skillsSection = extractSection(text, 'skills');
    if (!skillsSection) return ['Not found'];

    // First check for bullet points
    const bulletMatches = [...skillsSection.matchAll(regexPatterns.bulletPoints)];
    if (bulletMatches.length > 0) {
      return bulletMatches.map(match => match[1].trim());
    }

    // If no bullet points, split by common separators
    const skills = skillsSection
      .replace(/\n/g, ' ')  // Replace newlines with spaces
      .split(regexPatterns.skillSeparators)
      .map(skill => skill.trim())
      .filter(skill => skill && skill.length > 1);  // Filter out empty or single-char entries

    return skills.length > 0 ? skills : ['Not found'];
  };

  const handleProcess = () => {
    if (!resumeText.trim()) {
      setError('Please enter resume text or upload a file');
      return;
    }
    extractInformation(resumeText);
  };

  const loadSample = () => {
    setResumeText(sampleResume);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Resume Content Extractor</h1>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Upload Resume (Text format)</label>
        <input
          type="file"
          accept=".txt,.pdf,.doc,.docx"
          onChange={handleFileUpload}
          className="p-2 border rounded w-full"
        />
        <p className="text-xs mt-1 text-gray-500">Note: This demo works best with simple text files</p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Or paste resume text</label>
        <textarea
          value={resumeText}
          onChange={handleTextInput}
          className="p-2 border rounded w-full h-48"
          placeholder="Paste resume content here..."
        ></textarea>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={handleProcess}
          disabled={isProcessing || !resumeText.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
        >
          {isProcessing ? 'Processing...' : 'Extract Information'}
        </button>

        <button
          onClick={loadSample}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
        >
          Load Sample Resume
        </button>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {extractedData && (
        <div className="border rounded p-6">
          <h2 className="text-xl font-bold mb-4">Extracted Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="mb-4">
              <h3 className="font-bold mb-2">Basic Information</h3>
              <p>
                <span className="font-medium">Name:</span> {extractedData.fullName}
              </p>
              <p>
                <span className="font-medium">Email:</span> {extractedData.email}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {extractedData.phone}
              </p>
            </div>

            <div className="mb-4">
              <h3 className="font-bold mb-2">Skills</h3>
              <ul className="list-disc pl-5">
                {extractedData.skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-bold mb-2">Education</h3>
            <ul className="list-disc pl-5">
              {extractedData.education.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="font-bold mb-2">Experience</h3>
            <ul className="list-disc pl-5">
              {extractedData.experience.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeExtractor;