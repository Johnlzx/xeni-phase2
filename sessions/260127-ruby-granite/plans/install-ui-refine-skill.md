# Install UI Refine Skill

## Summary
Create a new skill called "ui-refine" that transforms vague UI modification requests into precise, actionable instructions with specific values and technical specifications.

## Steps

1. **Create skill directory** - Create `/Users/zhongxin/Documents/CosX/Xeni/Prototype/xeni-phase2/skills/ui-refine/`

2. **Create SKILL.md** - Write the skill definition file with:
   - YAML frontmatter (name: "UI Refine", description, icon)
   - Process documentation (gather info, output format)
   - Domain vocabulary for visual and interaction patterns
   - Examples for vague inputs, visual hierarchy, and loading states
   - Guidelines for precision and scope protection

3. **Validate skill** - Run `skill_validate` to ensure the skill is properly configured

## Files to Create

| File | Purpose |
|------|---------|
| `skills/ui-refine/SKILL.md` | Main skill definition with instructions |
