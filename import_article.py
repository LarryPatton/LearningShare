#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
文章导入工具 - 带GUI界面
用于将准备好的文章资料自动导入到博客网站目录
"""

import os
import shutil
import re
from datetime import datetime
from pathlib import Path
import tkinter as tk
from tkinter import ttk, filedialog, messagebox, scrolledtext

class ArticleImporter:
    def __init__(self, root):
        self.root = root
        self.root.title("📝 文章导入工具 - Learning Share")
        self.root.geometry("800x700")
        self.root.resizable(True, True)
        
        # 获取当前脚本所在目录
        self.script_dir = Path(__file__).parent.absolute()
        self.target_base = self.script_dir / "public" / "content" / "posts"
        
        # 分类映射（中文显示名 -> 英文目录名）
        self.categories = {
            "AI 人工智能": "ai",
            "Coding 编程技术": "coding",
            "GAME 游戏": "game",
            "MKT 市场营销": "mkt",
            "创业": "startup",
            "个人成长": "personal-growth",
            "管理": "management",
            "金融": "finance",
            "社交": "social",
            "时政": "politics"
        }
        
        self.setup_ui()
    
    def setup_ui(self):
        """设置UI界面"""
        # 样式配置
        style = ttk.Style()
        style.configure('Title.TLabel', font=('Microsoft YaHei UI', 14, 'bold'))
        style.configure('Section.TLabel', font=('Microsoft YaHei UI', 10, 'bold'))
        style.configure('Action.TButton', font=('Microsoft YaHei UI', 10))
        
        # 主容器
        main_frame = ttk.Frame(self.root, padding="20")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # 标题
        title = ttk.Label(main_frame, text="📝 文章导入工具", style='Title.TLabel')
        title.grid(row=0, column=0, columnspan=3, pady=(0, 20))
        
        # ===== 第1步：选择源文件夹 =====
        ttk.Label(main_frame, text="第1步：选择源文件夹", style='Section.TLabel').grid(
            row=1, column=0, columnspan=3, sticky=tk.W, pady=(10, 5)
        )
        
        self.source_path = tk.StringVar()
        ttk.Entry(main_frame, textvariable=self.source_path, width=60).grid(
            row=2, column=0, columnspan=2, sticky=(tk.W, tk.E), padx=(0, 10)
        )
        ttk.Button(main_frame, text="📁 浏览", command=self.browse_source).grid(
            row=2, column=2
        )
        
        # ===== 第2步：选择分类 =====
        ttk.Label(main_frame, text="第2步：选择分类", style='Section.TLabel').grid(
            row=3, column=0, columnspan=3, sticky=tk.W, pady=(20, 5)
        )
        
        self.category_var = tk.StringVar()
        category_combo = ttk.Combobox(
            main_frame, 
            textvariable=self.category_var,
            values=list(self.categories.keys()),
            state='readonly',
            width=30
        )
        category_combo.grid(row=4, column=0, sticky=tk.W)
        category_combo.current(1)  # 默认选择 "Coding"
        
        # ===== 第3步：子分类（可选）=====
        ttk.Label(main_frame, text="第3步：子分类（可选）", style='Section.TLabel').grid(
            row=5, column=0, columnspan=3, sticky=tk.W, pady=(20, 5)
        )
        
        ttk.Label(main_frame, text="例如：design-patterns, frontend, machine-learning").grid(
            row=6, column=0, columnspan=3, sticky=tk.W
        )
        
        self.subcategory_var = tk.StringVar()
        ttk.Entry(main_frame, textvariable=self.subcategory_var, width=40).grid(
            row=7, column=0, sticky=tk.W, pady=(5, 0)
        )
        
        # ===== 第4步：文章Slug =====
        ttk.Label(main_frame, text="第4步：文章Slug（URL路径）", style='Section.TLabel').grid(
            row=8, column=0, columnspan=3, sticky=tk.W, pady=(20, 5)
        )
        
        ttk.Label(main_frame, text="自动从文件夹名生成，也可手动修改").grid(
            row=9, column=0, columnspan=3, sticky=tk.W
        )
        
        self.slug_var = tk.StringVar()
        ttk.Entry(main_frame, textvariable=self.slug_var, width=60).grid(
            row=10, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=(5, 0)
        )
        ttk.Button(main_frame, text="🔄 自动生成", command=self.generate_slug).grid(
            row=10, column=2
        )
        
        # ===== 第5步：文章信息 =====
        ttk.Label(main_frame, text="第5步：文章信息", style='Section.TLabel').grid(
            row=11, column=0, columnspan=3, sticky=tk.W, pady=(20, 5)
        )
        
        # 标题
        ttk.Label(main_frame, text="标题:").grid(row=12, column=0, sticky=tk.W, pady=(5, 0))
        self.title_var = tk.StringVar()
        ttk.Entry(main_frame, textvariable=self.title_var, width=60).grid(
            row=12, column=1, columnspan=2, sticky=(tk.W, tk.E), pady=(5, 0)
        )
        
        # 作者
        ttk.Label(main_frame, text="作者:").grid(row=13, column=0, sticky=tk.W, pady=(5, 0))
        self.author_var = tk.StringVar(value="CodeMaster")
        ttk.Entry(main_frame, textvariable=self.author_var, width=60).grid(
            row=13, column=1, columnspan=2, sticky=(tk.W, tk.E), pady=(5, 0)
        )
        
        # ===== 导入按钮 =====
        import_btn = ttk.Button(
            main_frame,
            text="🚀 开始导入",
            command=self.import_article,
            style='Action.TButton'
        )
        import_btn.grid(row=14, column=0, columnspan=3, pady=(30, 10))
        
        # ===== 日志输出 =====
        ttk.Label(main_frame, text="📋 操作日志:", style='Section.TLabel').grid(
            row=15, column=0, columnspan=3, sticky=tk.W, pady=(10, 5)
        )
        
        self.log_text = scrolledtext.ScrolledText(
            main_frame,
            width=80,
            height=12,
            font=('Consolas', 9)
        )
        self.log_text.grid(row=16, column=0, columnspan=3, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # 配置网格权重
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        main_frame.columnconfigure(1, weight=1)
        main_frame.rowconfigure(16, weight=1)
        
        self.log("✅ 文章导入工具已启动")
        self.log(f"📁 目标目录: {self.target_base}")
    
    def log(self, message):
        """输出日志"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        self.log_text.insert(tk.END, f"[{timestamp}] {message}\n")
        self.log_text.see(tk.END)
        self.root.update()
    
    def browse_source(self):
        """浏览并选择源文件夹"""
        folder = filedialog.askdirectory(
            title="选择文章资料文件夹",
            initialdir="G:\\Notebook"
        )
        if folder:
            self.source_path.set(folder)
            self.log(f"✅ 已选择源文件夹: {folder}")
            
            # 自动生成slug和标题
            folder_name = Path(folder).name
            self.generate_slug()
            
            # 尝试从文件夹名提取标题
            title = re.sub(r'^[【\[].*?[】\]]', '', folder_name).strip()
            if title:
                self.title_var.set(title)
    
    def generate_slug(self):
        """从文件夹名自动生成slug"""
        source = self.source_path.get()
        if not source:
            return
        
        folder_name = Path(source).name
        
        # 移除特殊符号和前缀
        slug = re.sub(r'^[【\[].*?[】\]]', '', folder_name)
        slug = re.sub(r'[：:：]', '-', slug)
        slug = re.sub(r'[^\w\s-]', '', slug)
        slug = slug.strip().lower()
        slug = re.sub(r'[-\s]+', '-', slug)
        
        # 转换中文（可选：使用拼音库）
        # 这里简单处理，保留中文
        self.slug_var.set(slug)
        self.log(f"✅ 自动生成 slug: {slug}")
    
    def import_article(self):
        """执行文章导入"""
        # 验证输入
        source = self.source_path.get()
        if not source or not os.path.exists(source):
            messagebox.showerror("错误", "请选择有效的源文件夹")
            return
        
        category_cn = self.category_var.get()
        if not category_cn:
            messagebox.showerror("错误", "请选择分类")
            return
        
        slug = self.slug_var.get()
        if not slug:
            messagebox.showerror("错误", "请输入或生成文章 slug")
            return
        
        title = self.title_var.get()
        if not title:
            messagebox.showerror("错误", "请输入文章标题")
            return
        
        try:
            self.log("=" * 50)
            self.log("🚀 开始导入文章...")
            
            # 构建目标路径
            category_en = self.categories[category_cn]
            target_path = self.target_base / category_en
            
            # 如果有子分类
            subcategory = self.subcategory_var.get().strip()
            if subcategory:
                target_path = target_path / subcategory
            
            # 最终文章目录
            target_path = target_path / slug
            
            # 创建目录
            target_path.mkdir(parents=True, exist_ok=True)
            self.log(f"✅ 创建目标目录: {target_path}")
            
            # 复制所有文件
            source_path = Path(source)
            copied_files = []
            
            for item in source_path.iterdir():
                if item.is_file():
                    target_file = target_path / item.name
                    shutil.copy2(item, target_file)
                    copied_files.append(item.name)
                    self.log(f"   📄 复制: {item.name}")
            
            self.log(f"✅ 已复制 {len(copied_files)} 个文件")
            
            # 检查或创建 index.md
            index_file = target_path / "index.md"
            if not index_file.exists():
                self.log("⚠️  未找到 index.md，创建新文件...")
                self.create_index_md(index_file, title, slug, category_en, subcategory, copied_files)
            else:
                self.log("✅ index.md 已存在，跳过创建")
            
            self.log("=" * 50)
            self.log("🎉 文章导入成功！")
            self.log(f"📁 目标位置: {target_path}")
            
            # 提示用户
            result = messagebox.askyesno(
                "导入成功",
                f"文章已成功导入到：\n{target_path}\n\n是否打开目标文件夹？"
            )
            
            if result:
                os.startfile(target_path)
            
        except Exception as e:
            self.log(f"❌ 错误: {str(e)}")
            messagebox.showerror("导入失败", f"错误: {str(e)}")
    
    def create_index_md(self, file_path, title, slug, category, subcategory, files):
        """创建index.md文件"""
        # 检测资源文件
        resources = {}
        resource_mapping = {
            'cover': ['.png', '.jpg', '.jpeg'],
            'video': ['.mp4', '.mov', '.avi'],
            'audio': ['.mp3', '.m4a', '.wav'],
            'slides': ['.pdf', '.ppt', '.pptx'],
            'mindmap': ['mindmap.png', 'mindmap.jpg', '思维导图'],
            'flashcards': ['.csv', 'flashcards']
        }
        
        for file in files:
            file_lower = file.lower()
            
            # 检查cover
            if 'cover' in file_lower or '封面' in file:
                resources['cover'] = file
            # 检查video
            elif any(ext in file_lower for ext in resource_mapping['video']):
                resources['video'] = file
            # 检查audio
            elif any(ext in file_lower for ext in resource_mapping['audio']):
                resources['audio'] = file
            # 检查slides
            elif any(ext in file_lower for ext in resource_mapping['slides']):
                resources['slides'] = file
            # 检查mindmap
            elif 'mindmap' in file_lower or '思维导图' in file:
                resources['mindmap'] = file
            # 检查flashcards
            elif 'flashcard' in file_lower or file_lower.endswith('.csv'):
                resources['flashcards'] = file
        
        # 生成元数据
        today = datetime.now().strftime("%Y-%m-%d")
        author = self.author_var.get()
        
        metadata = f"""---
# 基本信息
title: {title}
slug: {slug}
date: {today}
author: {author}

# 分类
category: {category}"""
        
        if subcategory:
            metadata += f"\nsubcategory: {subcategory}"
        
        metadata += f"""
tags: []

# 内容描述
excerpt: {title}
difficulty: intermediate
readingTime: 15

# 资源
"""
        
        if 'cover' in resources:
            metadata += f"cover: {resources['cover']}\n"
        
        if len(resources) > 1 or (len(resources) == 1 and 'cover' not in resources):
            metadata += "resources:\n"
            for key, value in resources.items():
                if key != 'cover':
                    metadata += f"  {key}: {value}\n"
        
        metadata += """
# SEO
keywords: ""
---

# """ + title + """

## 引言

在这里编写文章内容...

"""
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(metadata)
        
        self.log(f"✅ 已创建 index.md")
        if resources:
            self.log(f"   检测到资源: {', '.join(resources.keys())}")

def main():
    root = tk.Tk()
    app = ArticleImporter(root)
    root.mainloop()

if __name__ == "__main__":
    main()
