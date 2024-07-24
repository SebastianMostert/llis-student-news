import React from 'react';
import styles from './reportCard.module.css';
import { MdSubdirectoryArrowRight } from 'react-icons/md';
import Comment from '../Comment/Comment';

// Component to display selected report options with arrows and counts
const ReportOptions = ({ options, count, hasArrow = false }) => {
    return (
        <div>
            {options.map((option, index) => {
                return (
                    <div key={index} className={styles.option} style={{ marginLeft: index * 20 }}>
                        {hasArrow && <MdSubdirectoryArrowRight className={styles.arrow} />}
                        {option} {index === options.length - 1 && count > 1 && ` (${count})`}
                    </div>
                );
            })}
        </div>
    );
};

// Helper function to count occurrences of each option path
const countReports = (reports) => {
    const reportMap = new Map();

    reports.forEach(report => {
        const path = report.reportOptions.join(' > ');
        reportMap.set(path, (reportMap.get(path) || 0) + 1);
    });

    return reportMap;
};

// Helper function to build the hierarchical structure
const buildHierarchy = (reportMap) => {
    const hierarchy = {};

    reportMap.forEach((count, path) => {
        const parts = path.split(' > ');
        let currentLevel = hierarchy;

        parts.forEach((part) => {
            if (!currentLevel[part]) {
                currentLevel[part] = { count: 0, children: {} };
            }
            currentLevel[part].count += count;
            currentLevel = currentLevel[part].children;
        });
    });

    return hierarchy;
};

// Component to render each level of the hierarchy
const RenderHierarchy = ({ node, depth = 0 }) => {
    return (
        <div>
            {Object.keys(node).map((key, index) => {
                const { count, children } = node[key];
                return (
                    <div key={index} className={styles.additionalReport} style={{ marginLeft: depth * 10 }}>
                        <ReportOptions options={key.split(' > ')} count={count} hasArrow={depth > 0} />
                        {Object.keys(children).length > 0 && (
                            <RenderHierarchy node={children} depth={depth + 1} />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

// Component to display additional reports related to the comment
const AdditionalReports = ({ reports }) => {
    const reportMap = countReports(reports);
    const hierarchy = buildHierarchy(reportMap);

    return (
        <div className={styles.additionalReports}>
            <h3>Reports</h3>
            {reports.length === 0 ? (
                <p>There are no reports.</p>
            ) : (
                <RenderHierarchy node={hierarchy} />
            )}
        </div>
    );
};

// Main ReportCard component
const ReportCard = ({ item: comment, mutate }) => {
    return (
        <div className={styles.reportCard}>
            <h2>Report Details</h2>

            <div className={styles.commentContainer}>
                <Comment
                    item={comment}
                    hasModButtons={true}
                    hasEngagementButtons={false}
                    mutate={mutate}
                    user={comment.user}
                    isLoggedIn={true}
                />
            </div>

            <AdditionalReports reports={comment.Report} />
        </div>
    );
};

export default ReportCard;
