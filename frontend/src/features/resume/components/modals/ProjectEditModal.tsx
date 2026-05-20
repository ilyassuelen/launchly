import {
  FolderKanban,
  Link2,
  Plus,
} from "lucide-react";

import { ResumeEditModal } from "@/features/resume/components/ui/ResumeEditModal";
import { ResumeFieldGroup } from "@/features/resume/components/ui/ResumeFieldGroup";
import { ResumeInput } from "@/features/resume/components/ui/ResumeInput";
import { ResumeTextarea } from "@/features/resume/components/ui/ResumeTextarea";
import { ResumeActionButton } from "@/features/resume/components/ui/ResumeActionButton";

type ProjectEditModalProps = {
  open: boolean;

  title: string;

  stack: string;

  bullets: string[];

  links?: string[];

  onChangeTitle: (
    value: string,
  ) => void;

  onChangeStack: (
    value: string,
  ) => void;

  onChangeBullet: (
    index: number,
    value: string,
  ) => void;

  onAddBullet: () => void;

  onChangeLink?: (
    index: number,
    value: string,
  ) => void;

  onAddLink?: () => void;

  onClose: () => void;

  onSave: () => void;
};

export function ProjectEditModal({
  open,

  title,

  stack,

  bullets,

  links = [],

  onChangeTitle,

  onChangeStack,

  onChangeBullet,

  onAddBullet,

  onChangeLink,

  onAddLink,

  onClose,

  onSave,
}: ProjectEditModalProps) {
  return (
    <ResumeEditModal
      open={open}
      title={
        title || "Edit Project"
      }
      subtitle="Manage project details, tech stack, achievements and links."
      onClose={onClose}
      footer={
        <div className="flex items-center justify-end gap-3">
          <ResumeActionButton
            variant="ghost"
            onClick={onClose}
          >
            Cancel
          </ResumeActionButton>

          <ResumeActionButton
            icon={<FolderKanban className="size-4" />}
            variant="primary"
            onClick={onSave}
          >
            Save Changes
          </ResumeActionButton>
        </div>
      }
    >
      <div className="space-y-6">

        <ResumeFieldGroup label="Project Title">
          <ResumeInput
            value={title}
            onChange={(e) =>
              onChangeTitle(
                e.target.value,
              )
            }
            placeholder="e.g. InsightAI"
          />
        </ResumeFieldGroup>

        <ResumeFieldGroup label="Tech Stack">
          <ResumeInput
            value={stack}
            onChange={(e) =>
              onChangeStack(
                e.target.value,
              )
            }
            placeholder="React · TypeScript · FastAPI"
          />
        </ResumeFieldGroup>

        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-white">
              Project Bullets
            </div>

            <ResumeActionButton
              icon={<Plus className="size-4" />}
              variant="primary"
              onClick={onAddBullet}
            >
              Add Bullet
            </ResumeActionButton>
          </div>

          <div className="space-y-5">
            {bullets.map(
              (bullet, index) => (
                <ResumeFieldGroup
                  key={index}
                  label={`Bullet ${
                    index + 1
                  }`}
                >
                  <ResumeTextarea
                    value={bullet}
                    onChange={(e) =>
                      onChangeBullet(
                        index,
                        e.target.value,
                      )
                    }
                    rows={4}
                    placeholder="Describe features, architecture or measurable impact"
                  />
                </ResumeFieldGroup>
              ),
            )}
          </div>
        </div>

        {onChangeLink && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-white">
                Project Links
              </div>

              {onAddLink && (
                <ResumeActionButton
                  icon={<Link2 className="size-4" />}
                  variant="primary"
                  onClick={onAddLink}
                >
                  Add Link
                </ResumeActionButton>
              )}
            </div>

            <div className="space-y-5">
              {links.map((link, index) => (
                <ResumeFieldGroup
                  key={index}
                  label={`Link ${
                    index + 1
                  }`}
                >
                  <ResumeInput
                    value={link}
                    onChange={(e) =>
                      onChangeLink(
                        index,
                        e.target.value,
                      )
                    }
                    placeholder="https://github.com/..."
                  />
                </ResumeFieldGroup>
              ))}
            </div>
          </div>
        )}
      </div>
    </ResumeEditModal>
  );
}